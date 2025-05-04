class DataService {
    constructor() {
        this.baseURL = "http://localhost:5000"; // Base URL for the API
        this.branchesCache = null; // Cache for branches
        this.appointmentsCache = null; // Cache for appointments
        this.servicesCache = null; // Cache for services
        this.lastAppointmentsFetchTime = null; // Timestamp of the last appointments fetch
    }

    // Fetch the list of branches
    async getBranches() {
        if (this.branchesCache) {
            return this.branchesCache;
        }

        try {
            const response = await fetch(`${this.baseURL}/branches`);
            if (!response.ok) {
                throw new Error(`Error fetching branches: ${response.statusText}`);
            }
            const data = await response.json();
            this.branchesCache = data;
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Fetch the list of appointments
    async getAppointments() {
        const now = new Date();

        if (
            this.appointmentsCache &&
            this.lastAppointmentsFetchTime &&
            (now - this.lastAppointmentsFetchTime) < 20 * 60 * 1000
        ) {
            return this.appointmentsCache;
        }

        try {
            const response = await fetch(`${this.baseURL}/appointments/today`);
            if (!response.ok) {
                throw new Error(`Error fetching appointments: ${response.statusText}`);
            }
            const data = await response.json();
            this.appointmentsCache = data;
            this.lastAppointmentsFetchTime = now;
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Fetch the list of services
    async getServices() {
        if (this.servicesCache) {
            return this.servicesCache;
        }

        try {
            const response = await fetch(`${this.baseURL}/services`);
            if (!response.ok) {
                throw new Error(`Error fetching services: ${response.statusText}`);
            }
            const data = await response.json();
            this.servicesCache = data;
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Get appointments by branch
    async getAppointmentsByBranch(branchId) {
        const appointments = await this.getAppointments();
        return appointments.filter((appointment) => appointment.branch_id === branchId);
    }

    // Get appointments by service
    async getAppointmentsByService(serviceId) {
        const appointments = await this.getAppointments();
        return appointments.filter((appointment) => appointment.service_id === serviceId);
    }

    // Get appointments by branch and service
    async getAppointmentsByBranchAndService(branchId, serviceId) {
        const appointments = await this.getAppointments();
        return appointments.filter(
            (appointment) => appointment.branch_id === branchId && appointment.service_id === serviceId
        );
    }

    // Get branches by district
    async getBranchesByDistrict(districtName) {
        const branches = await this.getBranches();
        return branches.filter((branch) => branch.district === districtName);
    }

    // Get branch ID by branch name
    async getBranchIdByName(branchName) {
        const branches = await this.getBranches();
        const branch = branches.find((branch) => branch.name === branchName);
        return branch ? branch.id : null; // Return the ID or null if not found
    }

    // Get service ID by service name
    async getServiceIdByName(serviceName) {
        const services = await this.getServices();
        const service = services.find((service) => service.name === serviceName);
        return service ? service.id : null; // Return the ID or null if not found
    }
}

// Create a singleton instance
const dataService = new DataService();
Object.freeze(dataService);

export default dataService;