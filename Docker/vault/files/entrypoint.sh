#!/usr/bin/env sh
set -eu

mkdir -p /opt/vault/file

vault server -config=/opt/vault/config/vault.hcl &
VAULT_PID=$!

# ждём API
i=0; until vault status >/dev/null 2>&1; do i=$((i+1)); [ $i -gt 120 ] && { echo "vault not ready"; exit 1; }; sleep 0.5; done
export VAULT_ADDR='http://127.0.0.1:8200'

if [ ! -f /opt/vault/file/.vault_initialized ]; then
  echo "[*] initializing vault 1/1…"
  vault operator init -key-shares=1 -key-threshold=1 > /opt/vault/file/init.out

  UNSEAL_KEY="$(awk -F': ' '/^Unseal Key 1:/{print $2; exit}' /opt/vault/file/init.out)"
  ROOT_TOKEN="$(awk -F': ' '/^Initial Root Token:/{print $2; exit}' /opt/vault/file/init.out)"

  [ -n "$UNSEAL_KEY" ] || { echo "cannot parse unseal key"; exit 1; }
  [ -n "$ROOT_TOKEN" ] || { echo "cannot parse root token"; exit 1; }

  printf "%s" "$UNSEAL_KEY" > /opt/vault/file/unseal_key.txt
  printf "%s" "$ROOT_TOKEN" > /opt/vault/file/root_token.txt

  vault operator unseal "$UNSEAL_KEY"
  touch /opt/vault/file/.vault_initialized
  echo "[*] vault initialized & unsealed"
else
  echo "[*] unsealing vault…"
  if [ -n "${VAULT_UNSEAL_KEY:-}" ]; then
    vault operator unseal "$VAULT_UNSEAL_KEY"
  else
    vault operator unseal "$(cat /opt/vault/file/unseal_key.txt)"
  fi
fi

wait "$VAULT_PID"