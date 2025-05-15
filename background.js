await browser.LegacyHelper.registerGlobalUrls([
  ["content", "eas4tbsync", "content/"],
]);

await browser.EAS4TbSync.load();

messenger.addressBooks.provider.onSearchRequest.addListener(async (node, searchString, query) => {
    // let response = await fetch("https://people.acme.com/?query=" + searchString);
    // let json = await response.json();
    console.log("node:", node)
    console.log("searchString:", searchString)
    console.log("query:", query)
    console.log("easbridge:", messenger.EASBridge)
    const json = await browser.EASBridge.searchGal(searchString);
    console.log("results:", json)
    return {
        isCompleteResult: true,
        // Return an array of ContactProperties as results.
        results: json.map(contact => ({
            DisplayName: contact.name,
            PrimaryEmail: contact.email
        }))
    };
}, {
    addressBookName: "GAL",
    isSecure: true,
});
