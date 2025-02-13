import fs from "fs";
import path from "path";

// Define the file path (adjust as needed)
const filePath = path.join(process.cwd(), "rapyd-client/api.ts");

try {
	// Read the file
	let fileContent = fs.readFileSync(filePath, "utf8");

	// Replace CouponDurationEnum with the correct type
	fileContent = fileContent.replace(
    	/CouponDurationEnum/g,
    	`"forever" | "repeating"`
	);

	// Fix incorrect enum references
	fileContent = fileContent.replace(
    	/V1PayoutsBodyBeneficiaryEntityTypeEnum/g,
    	"PayoutRequestBeneficiaryEntityTypeEnum"
	);

	// Write the corrected file back
	fs.writeFileSync(filePath, fileContent, "utf8");

	console.log("✅ Fixes applied successfully to rapyd-client/api.ts");
} catch (error) {
	console.error("❌ Error updating file:", error);
}
