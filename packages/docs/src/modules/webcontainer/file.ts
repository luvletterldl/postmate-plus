/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  'key.pem': {
    file: {
      contents: `
      -----BEGIN PRIVATE KEY-----
      MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgyD5tlDB4jE3q
      lFHTMJ/gPhmFmTnAwq+jckZOmqEjixBzSNBsQbzbEqCP27YRlVMB2wcYH2vMV3WD
      25KiibPljwqGilbsX98ia6JS35tI3vIMOkevCBxcjglqNheanZgt9hdAMxIpHa20
      VQk7jyjoGL4ZqMDXgDsyNcs/3Q2OotMpMs6bGH1QBDyRWv90+JBMeTFOUrVszChq
      1QQzwOlocpuqMwomFeQSRy7pR9arseOp5IfPmZhGSU3ydRFkTP27cdyu+NEy90pl
      FDgsxxX8RE+l1jEyegKyfxohwdcWbSYtX9YrDbT+2Hro47hpl6CzhzjjF5D7W70I
      dZVqvWvxAgMBAAECggEAZg1DmohfATvh3BB+nb1DuJE5ERihycwZ5cDp/qHharum
      OlDin2OxFFz+nJGJta3vw7XnIKKTVHCYn8a+aiDOlfg9NRv1ntdf/MaVKb7vR0RA
      7CBBj0vFZJfv2lK4oK/P+X3yzGjjY9tfk7HPwUSbs9QX6ppdAvnq5j7aCiKYFxsn
      pWxhsBrbxrC09YeX79fmgM9WmYZKHucb5Wz+tVJfLgbxvgAVvyUj0QioFgdakj+k
      qHKtF9MWDKj79j7aM+xsHmaUrS6xfw4HCnckjgtsKz00cd/ZXoWf2R98Ycoi+RAk
      4xeh/C/LuoJK9JHr6jWcq1+XHxInhHMETZd+puepSQKBgQDwglRBnbbfYmqISH3y
      uoi5YASrHRdAZY7sSVieS3QcrJRTpOldLuxAdJb+8lrWejhGdc1FSqgzuEFy7IUQ
      QhFnmX94GsB6cmxo19eEWPQ8lqS7B2ZgcYo+uoLnkF5J5l+1INrLFjTwtnUts+ZD
      We4xDINshDBKHY94qMcv/YjCwwKBgQDvQplztRY2pqYLk94NZ3rH3FmdxtieZxfV
      5RQ4mL07Iq8DeVanCRF9BHdXKG/2xE6fCz7Op7N69iVg9TjFsQAQfW8+QmKlnhRV
      /hEfpB+26Cq5rNZPugKw3JQysdIw3/miyTLMTx04T+hSf+NQgsBiPTO3u6AIFlaK
      0S94NsrDOwKBgD5yGF5RDMJDU1W/PLRhKk63V372NqtJsyo2gQPYo3UuefSdxNmk
      7UJvAyV+14cIhMQGoh1znOiQ1q14K7Rk8w/rEuWkTIV+YBd4s0RxtDhnBK5q5XH1
      COfwlTx6h4C4h/EHbsd8JJK7TQFozEiAeQ/TJ+xtBfy4YB/78nvLYE7xAoGAQmOf
      gtzHqih5wJKqNdv11MlO0Jnhd6qxkXd8Mewn7eXE3Fjp83VvtdnsZ3HgB4AXNMiB
      CAS+p6rvWkURGMHxe6HioUr4Zm5DxEy4Yag/6JfpaxYLbZn2ry61rI9s/ITZlxLv
      FoQJXpvFoka8Q5XUXi4PULcuQ7A3GVPMMTY68wsCgYEAx6jUgc6LEzLCY3Bjq2HH
      35gfc4MY//e74FUt4r8AETrzrdD51CVgRS2MW/nmRYWVa+ZnTgHIidpo/X7U7KEX
      kan6d172ts7xWI89mE/VJxm20OAT8SBr/ryow7kv3jxKdH8nJZdCKC1gUm78kks3
      l1UbdYwL/2oTcf8FgzpKpho=
      -----END PRIVATE KEY-----
      `,
    },
  },
  'cert.pem': {
    file: {
      contents: `
      -----BEGIN CERTIFICATE-----
      MIIEUjCCArqgAwIBAgIRALdCiSPMv6z613Z4FDwC+KIwDQYJKoZIhvcNAQELBQAw
      eTEeMBwGA1UEChMVbWtjZXJ0IGRldmVsb3BtZW50IENBMScwJQYDVQQLDB5zZW5h
      ckBzZW5hcmRlTWFjQm9vay1Qcm8ubG9jYWwxLjAsBgNVBAMMJW1rY2VydCBzZW5h
      ckBzZW5hcmRlTWFjQm9vay1Qcm8ubG9jYWwwHhcNMjMwMzEwMDUzMzU0WhcNMjUw
      NjEwMDUzMzU0WjBSMScwJQYDVQQKEx5ta2NlcnQgZGV2ZWxvcG1lbnQgY2VydGlm
      aWNhdGUxJzAlBgNVBAsMHnNlbmFyQHNlbmFyZGVNYWNCb29rLVByby5sb2NhbDCC
      ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAODIPm2UMHiMTeqUUdMwn+A+
      GYWZOcDCr6NyRk6aoSOLEHNI0GxBvNsSoI/bthGVUwHbBxgfa8xXdYPbkqKJs+WP
      CoaKVuxf3yJrolLfm0je8gw6R68IHFyOCWo2F5qdmC32F0AzEikdrbRVCTuPKOgY
      vhmowNeAOzI1yz/dDY6i0ykyzpsYfVAEPJFa/3T4kEx5MU5StWzMKGrVBDPA6Why
      m6ozCiYV5BJHLulH1qux46nkh8+ZmEZJTfJ1EWRM/btx3K740TL3SmUUOCzHFfxE
      T6XWMTJ6ArJ/GiHB1xZtJi1f1isNtP7YeujjuGmXoLOHOOMXkPtbvQh1lWq9a/EC
      AwEAAaN8MHowDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsGAQUFBwMBMB8G
      A1UdIwQYMBaAFJG4hGoq9yux01zhuMotszb77YS4MDIGA1UdEQQrMCmCBGV4YW2C
      CWxvY2FsaG9zdIcEfwAAAYcQAAAAAAAAAAAAAAAAAAAAATANBgkqhkiG9w0BAQsF
      AAOCAYEAEbCZAL8i2Z0+I88uyH48uAKHLtlHeg3ITtoL0LafRyivEbWnB7ktE4Ir
      QOHedpZYnNVDhBKmF8mtccXUZMbBnaAHZZQzYg8RnMDA7ibUAc55KmR1IpYmCnip
      BIldkShpWik4y5IcD/CPq/0jL6BS8N+WdomfYtHU5jxp7HirJACvjomRoRMxUADN
      Z9zMScc9nmQLCjbmS2CunItcJGEYEy4pv1UqSy0igWprZkjncF/UhPpvEgfVTvBG
      exleRZSNHj7kfPw0XlsZP1PQ2hpQsaCPbwBC3vENBfXiMLfaCHfwttMv32RP7H/O
      4sw4oUYoUcVPzZq3nZjkiLLIiUDU5kvuBUk869+RaQv+BL43fDGyA3UuphS+WpL6
      C2Lvh5HAEuW7XjNi6xe852rNxA1CbX/anlLXQsUDBEOj7211JefofPT2ZX6xxSYb
      +7dQJ9HlanhnMpabfCOwovRp6UTNFUMR9X2XuAW/XVLpL8W444air7OmQaG8icme
      ZnGVVBZC
      -----END CERTIFICATE-----
      `,
    },
  },
  'index.js': {
    file: {
      contents: `
      import { createServer } from 'node:https'
      import { readFileSync } from 'node:fs'
      import { WebSocketServer } from 'ws'

      const server = createServer({
        cert: readFileSync('cert.pem'),
        key: readFileSync('key.pem'),
      })
      const wss = new WebSocketServer({ server })

      wss.on('connection', (ws) => {
        ws.on('error', console.error)

        ws.on('message', (data) => {
          const msg = data.toString('utf-8')
          console.log('received:', msg)
          if (msg === 'ping')
            ws.send('pong')
        })

        ws.send('something')
      })

      server.listen(8080)
      `,
    },
  },
  'package.json': {
    file: {
      contents: `
        {
          "name": "wss-app",
          "type": "module",
          "dependencies": {
            "ws": "^8.13.0",
            "nodemon": "latest"
          },
          "scripts": {
            "start": "nodemon index.js"
          }
        }`,
    },
  },
}
