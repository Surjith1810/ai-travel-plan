// Simple validation script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    // Test 1: Check React Router DOM installation
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
        const hasRouter = packageJson.dependencies && packageJson.dependencies['react-router-dom'];
        test('react-router-dom installed', !!hasRouter);
    } catch (e) {
        test('react-router-dom installed', false);
    }

    // Test 2: Check Firebase config export
    try {
        const firebaseContent = fs.readFileSync(path.join(projectRoot, 'services/firebase.ts'), 'utf8');
        const exportsAuth = firebaseContent.includes('export const auth');
        const exportsDb = firebaseContent.includes('export const db');
        test('Firebase config exports auth/db', exportsAuth && exportsDb);
    } catch (e) {
        test('Firebase config exports auth/db', false);
    }

    // Test 3: Check AuthContext exists
    const authContextPath = path.join(projectRoot, 'context/AuthContext.tsx');
    test('AuthContext file exists', fs.existsSync(authContextPath));

    // Test 4: Check SignIn/SignUp pages
    test('SignIn page exists', fs.existsSync(path.join(projectRoot, 'pages/SignIn.tsx')));
    test('SignUp page exists', fs.existsSync(path.join(projectRoot, 'pages/SignUp.tsx')));

    // Test 5: Check ProtectedRoute
    test('ProtectedRoute exists', fs.existsSync(path.join(projectRoot, 'components/ProtectedRoute.tsx')));

    // Test 6: Check App.tsx uses Routes
    try {
        const appContent = fs.readFileSync(path.join(projectRoot, 'App.tsx'), 'utf8');
        const hasRoutes = appContent.includes('<Routes>') && appContent.includes('<Route');
        test('App.tsx uses Routes', hasRoutes);
    } catch (e) {
        test('App.tsx uses Routes', false);
    }

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');

    if (tests.failed > 0) {
        console.log(`\n❌ Validation Failed: ${tests.failed} tests passed.`);
        process.exit(1);
    } else {
        console.log('\n🎉 All validations passed!');
    }
}

runTests().catch(console.error);
