// Define the Roles type
type Roles = "ADMIN" | "SUPERADMIN" | "MANAGER" | "DELIVERY"; // Add more roles as needed

// You can also create a union type for specific roles dynamically
type RolesSet = Roles; // Allows any string role, in case you want dynamic roles in the future
