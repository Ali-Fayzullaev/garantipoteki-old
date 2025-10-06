"use server";

export async function getServices() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/services/${process.env.NEXT_PUBLIC_CODE}`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch services");
	}
	const json = await response.json();
	return json.services.services;
}

export async function createDeal(body: { name: string; phone_number: string }) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/deals`,
		{
			method: "POST",
			body: JSON.stringify({
				...body,
				code: process.env.NEXT_PUBLIC_CODE,
			}),
		}
	);
	if (!response.ok) {
		throw new Error("Failed to create deal");
	}
	const json = await response.json();
	return json.data.deal;
}

export async function updateDeal(
	body: { service_id: number; phone_number: string },
	dealId: string | number
) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/deals/${dealId}`,
		{
			method: "PATCH",
			body: JSON.stringify({
				...body,
				code: process.env.NEXT_PUBLIC_CODE,
			}),
		}
	);
	if (!response.ok) {
		throw new Error("Failed to update the deal");
	}
	return;
}

export async function updateTxt(body: {
	name: string;
	phone: string;
	service: string;
}) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_TXT_URL}/api/lead`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			}
		);
		if (!response.ok) {
			throw new Error("Failed to update txt");
		}
	} catch (error) {
		console.error(error);
	}
	return;
}

