import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { authenticate } from "../shopify.server";

// === LOADER ===
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const headersList = {
    "Accept": "application/json",
    "x-shopify-store": "augustdevstore.myshopify.com"
  };

  // const getRes = await fetch(
  //   "https://arlington-coaches-desert-male.trycloudflare.com/api/wishlist?action=get",
  //   {
  //     method: "GET",
  //     headers: headersList
  //   }
  // );

  const getRes = await fetch(
    "https://arlington-coaches-desert-male.trycloudflare.com/api/wishlist?action=getallstore",
    {
      method: "GET",
      headers: headersList
    }
  );

  const getData = await getRes.json();

  return {
    Test: "Test iWish L",
    GetData: getData
  };
};

// === ACTION ===
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const headersList = {
    "Accept": "application/json",
    "x-shopify-customer-id": "545556454454"
  };

  // const response = await fetch(
  //   "https://arlington-coaches-desert-male.trycloudflare.com/api/wishlist?action=add&handle=bud366",
  //   {
  //     method: "POST",
  //     headers: headersList
  //   }
  // );

  const data = await response.text();
  console.log("Action response:", data);

  return {
    Test: "Test iWish A",
    actionResponse: data
  };
};

// === COMPONENT ===
export default function Index() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  useEffect(() => {
    console.log("Loader Data:", loaderData.Test, loaderData.GetData);
  }, [shopify, loaderData]);

  // const handleAddToWishlist = () => {
  //   fetcher.submit({}, { method: "POST" });
  // };

  const handleGetData = () => {
    // Trigger the loader again using fetcher.load()
    fetcher.load("/");
  };

  // Use either loaderData (on first load) or fetcher.data (after clicking button)
  const wishlistData = fetcher.data?.GetData || loaderData.GetData;

  return (
    <s-page heading="Shopify app template">
      <s-section>
        <s-heading>i Wish</s-heading>
        <s-divider />

        {/* Add to Wishlist */}
        {/* <button onClick={handleAddToWishlist}>Add to Wishlist</button> */}
        {fetcher.data?.actionResponse && (
          <div>
            <p>Response: {fetcher.data.actionResponse}</p>
          </div>
        )}

        <s-divider />

        {/* Get Wishlist Data */}
        <button onClick={handleGetData}>Refresh Wishlist Data</button>

        {wishlistData && wishlistData.length > 0 ? (
          <div>
            <p>Wished Items:</p>
            <ul>
              {wishlistData.map((item, index) => (
                <li key={index}>{item.handle}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No wishlist items found.</p>
        )}
      </s-section>
    </s-page>
  );
}

// === HEADERS ===
export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
