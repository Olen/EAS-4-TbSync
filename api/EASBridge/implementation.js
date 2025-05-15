(function (exports) {
    function searchObjects(list, query) {
      const lowerQuery = query.toLowerCase();

      return list.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === "string" && value.toLowerCase().includes(lowerQuery)
        )
      );
    }

    var EASBridge = class extends ExtensionCommon.ExtensionAPI {
      getAPI(context) {
        return {
          EASBridge: {
            async searchGal(query) {
              console.log("searching GAL for", query);
              var { ExtensionParent } = ChromeUtils.importESModule(
                  "resource://gre/modules/ExtensionParent.sys.mjs"
              );
              var { MailServices } = ChromeUtils.importESModule(
                  "resource:///modules/MailServices.sys.mjs"
              );
              
              var tbsyncExtension = ExtensionParent.GlobalManager.getExtension(
                  "tbsync@jobisoft.de"
              );
              var { TbSync } = ChromeUtils.importESModule(
                  `chrome://tbsync/content/tbsync.sys.mjs?${tbsyncExtension.manifest.version}`
              );
              
              const eas = TbSync.providers.eas;
              console.log("EAS", eas);
              let result = []
              try {
                console.log("SyncData", eas.TbSync.SyncData);
                console.log("AccountData", eas.TbSync.SyncData.accountData);
                result = await eas.network.getSearchResults(eas.TbSync.SyncData.accountData, query)
              } catch (error) {
                console.error(error)
                const json = [
                  {
                    name: "Alice",
                    email: "alice@example.com"
                  },
                  {
                    name: "Bob",
                    email: "bob@example.com"
                  },
                  {
                    name: "Carol",
                    email: "carol@example.com"
                  }
                ];
                result = searchObjects(json, query);
              }
              console.log("Result", result);
              return result

              const account = eas.Account.getAccountById(accountId);
              if (!account) throw new Error("No such account");
    
              const wbxml = await eas.network.getSearchResults(account, query);
              const doc = eas.wbxmltools.parseWBXML(wbxml, "Search");
    
              const results = [];
              const nodes = doc.getElementsByTagName("Response");
              for (let i = 0; i < nodes.length; i++) {
                const get = tag => {
                  const el = nodes[i].getElementsByTagName(tag)[0];
                  return el?.textContent || null;
                };
    
                results.push({
                  displayName: get("DisplayName"),
                  email: get("EmailAddress"),
                  phone: get("Phone") || get("MobilePhone"),
                  company: get("Company"),
                  title: get("Title")
                });
              }
    
              return results;
            }
          }
        };
      }
    };
    exports.EASBridge = EASBridge;
})(this);

