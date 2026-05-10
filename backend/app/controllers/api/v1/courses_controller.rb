module Api
  module V1
    class CoursesController < ApplicationController
      before_action :set_course,         only: [:show, :update, :destroy]
      before_action :authorize_creator!, only: [:update, :destroy]

      def index
        courses = Course.all.order(created_at: :desc)
        courses = courses.where('LOWER(name) LIKE ?', "%#{params[:q].downcase}%") if params[:q].present?
        render json: courses.map { |c| course_json(c) }
      end

      def show
        render json: course_json(@course)
      end

      def create
        course = current_user.courses.build(course_params)
        if course.save
          render json: course_json(course), status: :created
        else
          render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @course.update(course_params)
          render json: course_json(@course)
        else
          render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @course.destroy
        head :no_content
      end

      private

      def set_course
        @course = Course.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Curso não encontrado' }, status: :not_found
      end

      def authorize_creator!
        render json: { error: 'Sem permissão' }, status: :forbidden unless @course.creator == current_user
      end

      def course_params
        params.permit(:name, :description, :start_date, :end_date)
      end

      def course_json(c)
        {
          id:            c.id,
          name:          c.name,
          description:   c.description,
          start_date:    c.start_date,
          end_date:      c.end_date,
          creator_id:    c.creator_id,
          lessons_count: c.lessons.count
        }
      end
    end
  end
end