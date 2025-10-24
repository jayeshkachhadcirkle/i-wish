import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  return {
    "Test": "Test iWish"
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);


  return {
    "Test": "Test iWish"
  };
};

export default function Index() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  useEffect(() => {
    console.log("HealthCheck :", loaderData.Test);

  }, [shopify, loaderData]);

  return (
    <s-page heading="Shopify app template">

      <s-section>
        <s-heading>i Wish</s-heading>
        <s-divider />
      </s-section>

    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
