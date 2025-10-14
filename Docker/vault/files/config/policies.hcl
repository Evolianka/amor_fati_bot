# Разрешаем только нужные операции для ключа bot-signatures
path "transit/encrypt/bot-signatures" {
  capabilities = ["update"]
}
path "transit/decrypt/bot-signatures" {
  capabilities = ["update"]
}
# для ротации/ограничений версий
path "transit/keys/bot-signatures" {
  capabilities = ["read", "update"]
}