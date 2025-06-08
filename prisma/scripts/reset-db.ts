import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const migrationsPath = path.resolve(__dirname, '../prisma/migrations');

console.log('Apagando a pasta de migrations...');
fs.rmSync(migrationsPath, { recursive: true, force: true });

console.log('Criando nova migration a partir do schema atual...');
execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

console.log('Banco recriado com sucesso!');
