
package florida.es.checkin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import com.sun.net.httpserver.HttpServer;

public class Servidor {

	static ServerSocket socketEscucha = null;
	static Socket cliente = null;

	public static void main(String[] args) throws IOException {
		
		//GET Informacion login= http://54.198.123.240:5000/api?login=[userId]
		//GET Informacion horario= http://54.198.123.240:5000/api?schedule=[userId]
		//GET Informacion descanso= http://54.198.123.240:5000/api?breaktime=[userId]
		//POST = http://54.198.123.240:5000/api/enviaDatos {accion,info,userId}
		//Acciones: 1. fichar entrada / 2. Fichar salida / 3.
		
		try {
			
			/*
			 * @param String
			 * @param File
			 * @param FileReader
			 * @param BufferReader
			 * @param Integer
			 * Reads the config.txt archive.
			 * */
			String rutaFicheroConfiguracion = "config.txt";
			File ficheroConfiguracion = new File(rutaFicheroConfiguracion);
			FileReader fr = new FileReader(ficheroConfiguracion);
			@SuppressWarnings("resource")
			BufferedReader br = new BufferedReader(fr);
	
			String host = br.readLine().split("=")[1];
			int puerto = Integer.parseInt(br.readLine().split("=")[1]);
			String contexto = br.readLine().split("=")[1];
			int backlog = Integer.parseInt(br.readLine().split("=")[1]);
			int numHilos = Integer.parseInt(br.readLine().split("=")[1]);
			
			System.out.println("IP: " + host);
			System.out.println("TCP Port: " + puerto);
			
			/*
			 * @param InetSocketAddress
			 * @param HttpServer
			 * @param ThreadPoolExecutor
			 * Launch the Server
			 * */
			InetSocketAddress direccionTCPIP = new InetSocketAddress(host, puerto);
			HttpServer servidor = HttpServer.create(direccionTCPIP, backlog);
			GestorHTTP gestorHTTP = new GestorHTTP();
			servidor.createContext(contexto, gestorHTTP);
			
			ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(numHilos);
			servidor.setExecutor(threadPoolExecutor);
			servidor.start();
			System.out.println("HTTP Server launched on Port " + puerto);

		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
