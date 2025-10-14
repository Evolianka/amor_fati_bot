ui            = true
cluster_addr  = "http://127.0.0.1:8201"
api_addr      = "http://127.0.0.1:8200"
disable_mlock = true

storage "raft" {           # "raft" здесь просто формат хранения на диске,
  path    = "/opt/vault/data"  # не про кластер. Один узел — ок.
  node_id = "node1"
}

listener "tcp" {
  address       = "127.0.0.1:8200"
  tls_disable = 1
}