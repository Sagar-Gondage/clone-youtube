// TODO: create script to seed categores

import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "Film & Animation",
    "Autos & Vehicles",
    "Music",
    "Pets & Animals",
    "Sports",
    "Travel",
    "Gaming",
    "News",
    "Education",
    "Howto & Style",
    "Science & Technology",
    "People & Blogs",
    "Entertainment",
    "Comedy",
    "Health & Wellness",
    "Lifestyle",
    "Fashion",
    "Food & Drink",
    "Home & Garden",
]

async function main() {
    console.log("Seeding categories...")

    try {
        const values = categoryNames.map(name => ({
            name,
            description: `${name.toLocaleLowerCase()} related videos`,
        }))
        await db.insert(categories).values(values);
        console.log("Categories seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

main();