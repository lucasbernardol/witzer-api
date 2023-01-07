# `/` - witzer-api

## Requisitos funcionais

### Encurtar URL's

- [] Cada usuário pode criar várias URLs
  - [] Deve de gerado um código único para cada registro.
  - [] Cada código _hash_ será um SHA512/hmac.
- [] Será possível redirecionar para a URL original quando o hash é fornecido corretamente
- [] Será possível lidar com QRCODES.
