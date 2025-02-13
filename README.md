# Using OpenAPI to Automate API Integration with Rapyd’s Payment Gateway

This repository demonstrates how to use OpenAPI to generate a TypeScript client from the Rapyd OpenAPI spec. This TS client is then used to integrate with Rapyd API.

## Prerequisites

To run this project locally, you need to have the following:

-   [Node.js](https://nodejs.org/en) installed on your local machine
-   A [Rapyd account](https://dashboard.rapyd.net/sign-up)
-   [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your local machine
-   [ngrok](https://ngrok.com/docs/getting-started/) installed on your local machine
-   A code editor and a web browser

## Running Locally

1. Obtain Rapyd API access and secret keys from **Developers** > **API access control** on the Rapyd dashboard.

2. Clone the repository.

3. Rename `.env.example` to `.env` and assign provide the access and secret keys to the respective variables in the `.env` file.

4. Install the dependencies and seed the database using the following commands:

    ```bash
    npm install

    npm run seed:products
    ```

5. Generate a TS client for Rapyd API:

    ```bash
    npx @openapitools/openapi-generator-cli generate -i https://raw.githubusercontent.com/Rapyd-Samples/RapydOpenAPI/master/rapyd-openapi.yaml -g typescript-axios -o ./rapyd-client
    ```

6. Fix the generated client:

    ```bash
    ts-node fix-generated-client.ts
    ```

7. Run ngrok locally, copy the forwarding URL and assign it to the `BASE_URI` variable in the `.env` file:

    ```bash
    ngrok http 3000
    ```

8. Open your Rapyd dashboard, navigate to **Developers** > **Webhooks** > **Management**, and in the callback URL field, provide the value of the ngrok forwarding URL and append "/webhook/rapyd" to it. Under "Collect", make sure the **Payment Completed** event is selected so that Rapyd can send you a webhook once this event is triggered. Make sure you save the changes by clicking **Save**.

9. Run the server using the command `npm run dev` and open the ngrok forwarding URL on your web browser.

10. Log into the application, add some items to cart, and proceed to checkout.

### Get Support

Check out some of our [samples](ttps://github.com/Rapyd-Samples/accept-payments) to learn how to build with Rapyd, and feel free to drop any questions you might have in [our community](https://community.rapyd.net/).
