module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request!, only: [:register, :login]

      def register
        user = User.new(user_params)
        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: { token: token, user: user_json(user) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email]&.downcase)
        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: { token: token, user: user_json(user) }
        else
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      end

      def me
        render json: { user: user_json(current_user) }
      end

      private

      def user_params
        params.permit(:name, :email, :password, :password_confirmation)
      end

      def user_json(u)
        { id: u.id, name: u.name, email: u.email }
      end
    end
  end
end