import { NextRequest, NextResponse } from "next/server";
import { ApiService } from "../../../services/apiService";

export async function POST(req: NextRequest) {
    try {
        console.log("API route called");

        try {
            const healthCheck = await ApiService.checkBackendHealth();
            console.log("Backend health check:", healthCheck);
        } catch (healthError: any) {
            console.error("Backend health check failed:", healthError.message);

            if (healthError.code === "ECONNREFUSED") {
                return NextResponse.json(
                    {
                        error: "Backend server is not running on port 5000. Please start the backend server with: cd backend && npm run dev",
                    },
                    { status: 503 }
                );
            }

            return NextResponse.json(
                {
                    error: `Cannot connect to backend server. Error: ${healthError.message}`,
                },
                { status: 503 }
            );
        }

        const formData = await req.formData();
        console.log("FormData received, sending to backend...");

        const frontFile = formData.get("front") as File;
        const backFile = formData.get("back") as File;

        if (!frontFile || !backFile) {
            return NextResponse.json(
                {
                    error: "Please upload both front and back images.",
                },
                { status: 400 }
            );
        }

        const response = await ApiService.uploadImages(frontFile, backFile);

        console.log("Backend response received:", response);
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("API route error:", error);

        if (error.response) {
            console.error("Backend error response:", error.response.data);
            return NextResponse.json(
                {
                    error: error.response.data?.error || "Backend processing failed",
                    details: error.response.data,
                },
                { status: error.response.status }
            );
        }

        if (error.code === "ECONNREFUSED") {
            return NextResponse.json(
                {
                    error: "Backend server is not running. Please start the backend server.",
                },
                { status: 503 }
            );
        }

        if (error.code === "ENOTFOUND") {
            return NextResponse.json(
                {
                    error: "Cannot connect to backend server. Check BACKEND_URL configuration.",
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            {
                error: "Invalid upload. Please upload valid Aadhaar front and back images.",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
