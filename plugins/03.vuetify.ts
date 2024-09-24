import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { zhHant, en } from 'vuetify/locale'
import { VDataTableServer, VDatePicker } from 'vuetify/components'
import 'vuetify/styles'

zhHant.dataFooter.pageText = '{2} 筆中的 {0} — {1} 筆'
export default defineNuxtPlugin({
    name: "vuetify",
    parallel: true,
    dependsOn: ["polyfill"],
    hooks: {
        async 'app:created'() {
            const nuxt = useNuxtApp()
            const vuetify = createVuetify({
                ssr: false,
                components: { ...components, VDataTableServer, VDatePicker },
                directives,
                locale: {
                    locale: 'zhHant',
                    fallback: 'en',
                    messages: { zhHant, en },
                },
            })
            nuxt.vueApp.use(vuetify)
        },
    },
})

