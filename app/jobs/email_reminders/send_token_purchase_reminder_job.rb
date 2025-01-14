module EmailReminders
  class SendTokenPurchaseReminderJob < ApplicationJob
    queue_as :default

    def perform
      users = User
        .joins(:talent)
        .joins("LEFT JOIN talent_supporters ON talent_supporters.supporter_wallet_id = users.wallet_id")
        .where(talent_supporters: {id: nil})
        .where(token_purchase_reminder_sent_at: nil)
        .where("talent.created_at < ?", ENV["EMAIL_REMINDER_DAYS"].to_i.days.ago)

      users.find_each do |user|
        UserMailer.with(user: user).send_token_purchase_reminder_email.deliver_later
      end
    end
  end
end
