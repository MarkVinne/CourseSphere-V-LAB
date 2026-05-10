class Lesson < ApplicationRecord
  belongs_to :course

  STATUSES = %w[draft published].freeze

  validates :title,  presence: true, length: { minimum: 3 }
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :video_url,
    format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), message: 'URL inválida' },
    allow_blank: true
end