class ApplicationController < ActionController::API
  before_action :authenticate_request!

  private

  def authenticate_request!
    header = request.headers['Authorization']
    token  = header.split(' ').last if header
    unless token
      render json: { error: 'Não autorizado' }, status: :unauthorized and return
    end
    begin
      @decoded      = JsonWebToken.decode(token)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { error: 'Não autorizado' }, status: :unauthorized
    end
  end

  def current_user = @current_user
end