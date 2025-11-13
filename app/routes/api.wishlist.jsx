import db from "../db.server";

export const loader = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const handle = searchParams.get("handle");
    const customerId = request.headers.get("x-shopify-customer-id") || "test-user";
    const store = request.headers.get("x-shopify-store") || "no-store.myshopify.com";
    if (action === "get") {
        const items = await db.wishlist.findMany({
            where: { customerId },
            select: { handle: true },
        });
        return items;
    }

    if (action === "getall") {
        const items = await db.wishlist.findMany({
            where: { customerId, store },
            select: { handle: true },
        });
        return items;
    }

    return Response.json({ status: "ok" });
};

export const action = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const handle = searchParams.get("handle");
    const customerId = request.headers.get("x-shopify-customer-id") || "test-user";
    const store = request.headers.get("x-shopify-store") || "no-store.myshopify.com";
    if (!customerId || !action) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (action === "add") {
        await db.wishlist.upsert({
            where: { customerId_handle_store: { customerId, handle, store } },
            create: { customerId, handle, store },
            update: {},
        });
        return Response.json({ success: true });
    }

    if (action === "remove") {
        await db.wishlist.deleteMany({
            where: { customerId, handle, store },
        });
        return Response.json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
};
