import db from "../db.server";

export const loader = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const handle = searchParams.get("handle");
    const customerId = request.headers.get("x-shopify-customer-id") || "test-user";
    if (action === "gety") {
        const items = await db.wishlist.findMany({
            where: { customerId },
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

    if (!customerId || !action) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (action === "add") {
        await db.wishlist.upsert({
            where: { customerId_handle: { customerId, handle } },
            create: { customerId, handle },
            update: {},
        });
        return Response.json({ success: true });
    }

    if (action === "remove") {
        await db.wishlist.deleteMany({
            where: { customerId, handle },
        });
        return Response.json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
};
