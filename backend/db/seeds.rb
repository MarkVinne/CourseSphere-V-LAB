User.find_or_create_by!(email: 'teste@coursesphere.com') do |u|
  u.name = 'Usuário Teste'
  u.password = 'senha123'
end