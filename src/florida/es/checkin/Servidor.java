
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
import java.util.Scanner;

import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStreamReader;

public class Servidor {

	static ServerSocket socketEscucha = null;
	static Socket cliente = null;

	public static void main(String[] args) throws IOException {
		
		
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
		
		Scanner scanner = new Scanner(System.in);
        System.out.print("Execute auto-checkout? (will add an exit record to every entry record without its corresponding exit record) (y/n): ");
        String respuesta = scanner.nextLine();
        if (respuesta.equals("y") || respuesta.equals("yes") || respuesta.equals("s")) {
        	try {
                String result = fetch("http://35.170.135.172:5000/api?autoCheckout=hello");
                System.out.println("Executing auto-Chechkout...");
            } catch (IOException e) {
            	System.out.println("Auto chechkout has failed or is not necessary");
            }
        } else if (respuesta.equals("n")) {
            System.out.println("Ok, wont auto-Checkout");
        } else {
            System.out.println("Ok, wont auto-Checkout");
        }
		
		
	}
	public static String fetch(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();

        return content.toString();
    }
}
