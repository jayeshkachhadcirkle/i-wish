import db from "../db.server";

export const loader = async ({ request }) => {
    return { status: "ok" };
};

export const action = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const handle = searchParams.get("handle");
    const customerId = request.headers.get("x-shopify-customer-id"); // App proxy passes this if logged in

    if (!customerId || !handle) {
        return [{ error: "Missing customer or handle" }, { status: 400 }];
    }

    if (action === "add") {
        await db.wishlist.upsert({
            where: { customerId_handle: { customerId, handle } },
            create: { customerId, handle },
            update: {},
        });
        return { success: true };
    }

    if (action === "remove") {
        await db.wishlist.deleteMany({
            where: { customerId, handle },
        });
        return { success: true };
    }

    if (action === "get") {
        const items = await db.wishlist.findMany({
            where: { customerId },
            select: { handle: true },
        });
        return { items };
    }

    return [{ error: "Invalid action" }, { status: 400 }];
};
