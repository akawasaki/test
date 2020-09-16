import { Cat } from '../models/Cat';

export interface ICatService {
  create(params: Pick<Cat, 'name' | 'age' | 'color'>): Promise<Cat>;
  get(id: Cat['id']): Promise<Cat>;
  getAll(): Promise<Cat[]>;
  delete(id: Cat['id']);
  updateName(id: Cat['id'], name: Cat['name']): Promise<Cat>;
  updateColor(id: Cat['id'], color: Cat['color']): Promise<Cat>;
}
