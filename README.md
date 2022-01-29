# Better Social

## About
[https://BetterSocial.life](https://bettersocial.life)

Better Social is a tool for self-hosting your Facebook data obtained through [Facebook's DYI tool](https://www.facebook.com/dyi/). Right now it supports hosting on Google Drive, but we hope to expand it to other providers in the future.

It's a static site that fetches data from one of the providers and displays it in the browser. We have no servers. We just provide the glue that connects your hosted data to your browser. The aim is to give you full control over your data, while still making it convenient to view.

### Why Google?
Taking your data from one controversy-ridden tech behemoth whose business model is essentially using your data to sell ads and uploading it to another may seem like it doesn’t buy you much. However, while Google is mainly funded through ad revenue, Google Drive is mainly funded through selling you more storage. No one would use a cloud storage provider that snooped through their content. Google Drive's Terms of Service state that "your content remains yours." In addition, according to Google's Privacy Policy, your data is not shared with anyone else except your domain administrator, in the case that you have an organizational account, or in the case of legal matters.

We plan to support more cloud storage providers in the future, but decided to prove out the concept of this tool with Google Drive because most people already have an account, it offers free storage, and has the APIs and capacity to power this application.

## Development

### Run
`yarn install`

`yarn start`

### Deploy
`yarn build`
