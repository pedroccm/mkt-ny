export interface Agencia {
  title: string;
  place_id: string;
  data_id: string;
  data_cid: string;
  reviews_link: string;
  photos_link: string;
  posts_link: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  provider_id: string;
  rating: number;
  reviews: number;
  type: string;
  types: string[];
  address: string;
  open_state: string;
  hours: string;
  operating_hours: Record<string, string>;
  phone: string;
  website: string;
  thumbnail: string;
  image: string;
  google_maps_url: string;
  unclaimed_business: null | any;
  price: string | null;
}

export interface Restaurante {
  title: string;
  place_id: string;
  data_id: string;
  data_cid: string;
  reviews_link: string;
  photos_link: string;
  posts_link: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  provider_id: string;
  rating: number;
  reviews: number;
  price?: string;
  type: string;
  types: string[];
  address: string;
  open_state: string;
  hours: string;
  operating_hours: Record<string, string>;
  phone: string;
  website: string;
  description?: string;
  thumbnail: string;
  image: string;
  google_maps_url: string;
  unclaimed_business: null | any;
}

let agenciasData: Agencia[] | null = null;
let restaurantesData: Restaurante[] | null = null;

export async function loadAgencias(): Promise<Agencia[]> {
  if (agenciasData) {
    return agenciasData;
  }
  
  try {
    const response = await fetch('/agencias.json');
    if (!response.ok) {
      throw new Error('Failed to load agencias data');
    }
    agenciasData = await response.json();
    return agenciasData || [];
  } catch (error) {
    console.error('Error loading agencias:', error);
    return [];
  }
}

export async function loadRestaurantes(): Promise<Restaurante[]> {
  if (restaurantesData) {
    return restaurantesData;
  }
  
  try {
    const response = await fetch('/restaurantes.json');
    if (!response.ok) {
      throw new Error('Failed to load restaurantes data');
    }
    restaurantesData = await response.json();
    return restaurantesData || [];
  } catch (error) {
    console.error('Error loading restaurantes:', error);
    return [];
  }
}

export function getAgenciaById(id: string): Promise<Agencia | null> {
  return loadAgencias().then(agencias => 
    agencias.find(agencia => agencia.place_id === id || agencia.data_id === id) || null
  );
}

export function getRestauranteById(id: string): Promise<Restaurante | null> {
  return loadRestaurantes().then(restaurantes => 
    restaurantes.find(restaurante => restaurante.place_id === id || restaurante.data_id === id) || null
  );
}

export function searchAgencias(query: string): Promise<Agencia[]> {
  return loadAgencias().then(agencias => 
    agencias.filter(agencia => 
      agencia.title.toLowerCase().includes(query.toLowerCase()) ||
      agencia.address.toLowerCase().includes(query.toLowerCase()) ||
      agencia.type.toLowerCase().includes(query.toLowerCase())
    )
  );
}

export function searchRestaurantes(query: string): Promise<Restaurante[]> {
  return loadRestaurantes().then(restaurantes => 
    restaurantes.filter(restaurante => 
      restaurante.title.toLowerCase().includes(query.toLowerCase()) ||
      restaurante.address.toLowerCase().includes(query.toLowerCase()) ||
      restaurante.type.toLowerCase().includes(query.toLowerCase()) ||
      (restaurante.description && restaurante.description.toLowerCase().includes(query.toLowerCase()))
    )
  );
}