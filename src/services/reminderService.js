import moment from "moment-timezone";
import { getFirestore, admin } from "../config/database.js";
import { emailService } from "./emailService.js";

export const reminderService = {
  async processReminders() {
    const db = getFirestore();
    const now = moment.utc();

    console.log(
      `⏰ Current UTC time: ${now.format("YYYY-MM-DD HH:mm:ss")} UTC`
    );

    const remindersSnapshot = await db
      .collection("ReminderEmails")
      .where("reminderSent", "==", false)
      .get();

    console.log(`📧 Found ${remindersSnapshot.size} pending reminders`);

    let processedCount = 0;
    let sentCount = 0;

    for (const doc of remindersSnapshot.docs) {
      const reminderData = doc.data();
      processedCount++;

      let shouldSend = false;
      let appointmentUTC;

      if (reminderData.appointmentTimeUTC) {
        appointmentUTC = moment.utc(reminderData.appointmentTimeUTC);
      } else {
        const timezone = reminderData.doctorTimezone || "America/New_York";
        const localDateTime = `${reminderData.appointmentDate} ${reminderData.appointmentTime}`;
        appointmentUTC = moment
          .tz(localDateTime, "YYYY-MM-DD h:mm A", timezone)
          .utc();
      }

      const reminderTimeUTC = appointmentUTC.clone().subtract(10, "minutes");
      const bufferTimeUTC = reminderTimeUTC.clone().subtract(5, "minutes");

      shouldSend =
        now.isSameOrAfter(bufferTimeUTC) &&
        now.isBefore(appointmentUTC) &&
        !reminderData.reminderSent;

      if (shouldSend) {
        console.log(`✅ Sending reminder to ${reminderData.parentEmail}...`);

        try {
          await emailService.sendReminderEmails(reminderData);

          await doc.ref.update({
            reminderSent: true,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            sentVia: "reminder-service",
          });

          sentCount++;
          console.log(
            `🎉 Reminder sent successfully to ${reminderData.parentEmail}`
          );
        } catch (emailError) {
          console.error(`❌ Error sending reminder:`, emailError);
          await doc.ref.update({
            reminderSent: false,
            lastError: emailError.message,
            lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }

    const result = {
      processedCount,
      sentCount,
      timestamp: now.toISOString(),
      source: "reminder-service",
    };

    console.log(
      `✅ Reminder processing completed: Processed ${processedCount} reminders, sent ${sentCount} emails`
    );
    return result;
  },

  async createReminder(reminderData) {
    const db = getFirestore();

    const reminder = {
      ...reminderData,
      scheduledAt: new Date().toISOString(),
      reminderSent: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const reminderRef = await db.collection("ReminderEmails").add(reminder);
    console.log("✅ Reminder created with ID:", reminderRef.id);

    return reminderRef.id;
  },

  async getReminders(limit = 20) {
    const db = getFirestore();
    const now = moment.utc();

    const remindersSnapshot = await db
      .collection("ReminderEmails")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const reminders = [];

    remindersSnapshot.forEach((doc) => {
      const data = doc.data();
      let appointmentUTC;

      if (data.appointmentTimeUTC) {
        appointmentUTC = moment.utc(data.appointmentTimeUTC);
      } else {
        const timezone = data.doctorTimezone || "America/New_York";
        appointmentUTC = moment
          .tz(
            `${data.appointmentDate} ${data.appointmentTime}`,
            "YYYY-MM-DD h:mm A",
            timezone
          )
          .utc();
      }

      const reminderTimeUTC = appointmentUTC.clone().subtract(10, "minutes");
      const bufferTimeUTC = reminderTimeUTC.clone().subtract(5, "minutes");

      const shouldSendNow =
        now.isSameOrAfter(bufferTimeUTC) &&
        now.isBefore(appointmentUTC) &&
        !data.reminderSent;

      reminders.push({
        id: doc.id,
        parentEmail: data.parentEmail,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        appointmentTimeUTC: appointmentUTC.format(),
        reminderTimeUTC: reminderTimeUTC.format(),
        bufferTimeUTC: bufferTimeUTC.format(),
        reminderSent: data.reminderSent,
        scheduledAt: data.scheduledAt,
        shouldSendNow,
        timeUntilReminder: reminderTimeUTC.diff(now, "minutes"),
        timeUntilAppointment: appointmentUTC.diff(now, "minutes"),
        doctorTimezone: data.doctorTimezone,
        userTimezone: data.userTimezone,
      });
    });

    return reminders.sort((a, b) => {
      if (a.shouldSendNow !== b.shouldSendNow) {
        return a.shouldSendNow ? -1 : 1;
      }
      return a.timeUntilReminder - b.timeUntilReminder;
    });
  },

  async sendTestReminder(reminderId) {
    const db = getFirestore();

    const reminderDoc = await db
      .collection("ReminderEmails")
      .doc(reminderId)
      .get();

    if (!reminderDoc.exists) {
      throw new Error("Reminder not found");
    }

    const reminderData = reminderDoc.data();
    await emailService.sendReminderEmails(reminderData);

    await reminderDoc.ref.update({
      reminderSent: true,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      testSend: true,
    });

    return reminderData;
  },
};
