import { initApp } from '~/app'
import { ENV_APP_PORT } from '~/config/env'

initApp()
  .then((app) => {
    app.listen(ENV_APP_PORT, '0.0.0.0', (err: Error | null) => {
      if (err) {
        app.log.error(err.message)
        process.exit(1)
      }
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
