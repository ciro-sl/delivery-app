// debug-output.js - Script para ver salida de comandos
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const runCommand = async (command, description) => {
  console.log(`\n🔧 Ejecutando: ${description}`);
  console.log(`📝 Comando: ${command}`);
  console.log('─'.repeat(50));
  
  try {
    const { stdout, stderr } = await execAsync(command, { 
      cwd: 'C:\\Users\\cir\\Desktop\\delivery-app\\server',
      timeout: 10000 
    });
    
    console.log('✅ SALIDA:');
    console.log(stdout);
    
    if (stderr) {
      console.log('⚠️ ERRORES:');
      console.log(stderr);
    }
    
    return { success: true, stdout, stderr };
  } catch (error) {
    console.log('❌ ERROR:');
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

const main = async () => {
  console.log('🚀 EJECUTANDO TODOS LOS COMANDOS PARA DEPURACIÓN');
  
  // PASO 1: Matar servidor
  await runCommand('node kill-server.js', 'Matar procesos existentes');
  
  // PASO 2: Limpiar base de datos
  await runCommand('node ultimate-clean.js', 'Limpiar base de datos');
  
  // PASO 3: Iniciar servidor (en background no funciona aquí)
  console.log('\n🔧 Iniciando servidor (esto quedará corriendo)...');
  console.log('📝 Comando: node start-final.js');
  console.log('💡 Necesitarás abrir otra terminal para los siguientes comandos');
  
  // PASO 4: Verificar servidor
  console.log('\n🔧 Esperando 3 segundos para que el servidor inicie...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await runCommand('node check-server.js', 'Verificar servidor');
  
  console.log('\n🎯 RESUMEN FINAL:');
  console.log('1. Servidor iniciado: node start-final.js');
  console.log('2. Verificación completada: node check-server.js');
  console.log('3. Frontend listo: npm run dev');
  console.log('\n✅ Si todo muestra "✅ NO HAY DUPLICADOS", está listo');
};

main().catch(console.error);
