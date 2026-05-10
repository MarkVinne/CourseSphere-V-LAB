module Api
  module V1
    class LessonsController < ApplicationController
      before_action :set_course
      before_action :set_lesson, only: [:update, :destroy]

      def index
        lessons = @course.lessons.order(:created_at)
        lessons = lessons.where(status: params[:status]) if params[:status].present?
        render json: lessons.map { |l| lesson_json(l) }
      end

      def create
        lesson = @course.lessons.build(lesson_params)
        if lesson.save
          render json: lesson_json(lesson), status: :created
        else
          render json: { errors: lesson.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @lesson.update(lesson_params)
          render json: lesson_json(@lesson)
        else
          render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @lesson.destroy
        head :no_content
      end

      private

      def set_course
        @course = Course.find(params[:course_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Curso não encontrado' }, status: :not_found
      end

      def set_lesson
        @lesson = @course.lessons.find(params[:id])
      end

      def lesson_params
        params.permit(:title, :status, :video_url)
      end

      def lesson_json(l)
        {
          id:        l.id,
          title:     l.title,
          status:    l.status,
          video_url: l.video_url,
          course_id: l.course_id
        }
      end
    end
  end
end