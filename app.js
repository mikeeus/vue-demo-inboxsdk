
InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

// Get an Inbox SDK App Id from here: https://www.inboxsdk.com/register
InboxSDK.load('1.0', 'INBOX_SDK_APP_ID').then(function(sdk){

  // the SDK has been loaded, now do something with it!
  sdk.Compose.registerComposeViewHandler(function(composeView){

    // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Vue Pipl Search",
      iconUrl: chrome.extension.getURL('icon.png'),
      onClick: function(event) {
        sdk.Widgets.showModalView({
          title: 'Vue Pipl Search',
          'el': `<div id="vue-pipl-search"></div>`,
        });

        const vuePiplSearch = new Vue({
          el: '#vue-pipl-search',
          template: `
            <div>
              <template v-if="recipients.length">
                <div v-if="person" style="text-align: center;">
                  <h2 style="text-align: center">
                    {{person.names[0].display}}
                  </h2>
                  <img :src="person.images[0].url" width="80px">
                  <p v-if="person.jobs[0]">{{person.jobs[0].title}}</p>
                </div>
                <div v-else>
                  Person was not found.
                </div>
              </template>
              <div v-else>
                Add an email recipient to search Pipl Api.
              </div>
            </div>
          `,

          data() {
            return {
              recipients: composeView.getToRecipients(),
              person: null
            }
          },

          created() {
            if (this.recipients.length) {
              this.loading = true

              // Get a Pipl Sample Key here: https://pipl.com/api/demo
              axios.get(`https://api.pipl.com/search/v5/?email=${this.recipients[0].emailAddress}&key=[PIPL_SAMPLE_KEY]`)
                .then(res => {
                  if (res.status === 200) {
                    this.person = res.data.person;
                    this.loading = false
                  }
                })
            }
          }
        })
      },
    });
  });
});
