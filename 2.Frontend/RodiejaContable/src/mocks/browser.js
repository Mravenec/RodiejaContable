import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// Mock data
const mockVehicles = [];
let nextId = 1;

const handlers = [
  // Get all vehicles
  http.get('http://localhost:3001/api/vehiculos', () => {
    return HttpResponse.json({
      success: true,
      data: mockVehicles
    });
  }),

  // Create new vehicle
  http.post('http://localhost:3001/api/vehiculos', async ({ request }) => {
    const newVehicle = await request.json();
    const vehicleWithId = {
      id: nextId++,
      ...newVehicle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockVehicles.push(vehicleWithId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json(
      {
        success: true,
        data: vehicleWithId
      },
      { status: 201 }
    );
  }),

  // Update vehicle
  http.put('http://localhost:3001/api/vehiculos/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const index = mockVehicles.findIndex(v => v.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    const updatedVehicle = {
      ...mockVehicles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockVehicles[index] = updatedVehicle;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({
      success: true,
      data: updatedVehicle
    });
  })
];

// Create and export the worker instance with the request handlers
export const worker = setupWorker(...handlers);

export { handlers };

// Start the worker in development mode
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  }).catch(console.error);
}
