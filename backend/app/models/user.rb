class User < ApplicationRecord
  has_secure_password
  has_many :courses, foreign_key: :creator_id, dependent: :destroy

  validates :name,  presence: true
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
end