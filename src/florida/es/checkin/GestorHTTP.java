package florida.es.checkin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class GestorHTTP implements HttpHandler {

	InputStream is = null;
	InputStreamReader isr = null;
	BufferedReader bf = null;
	PrintWriter pw = null;
	String ip = "127.0.0.1";
	String portDB = "3306";
	String database = "emiralcheckin";
	String userDB = "root";
	String pwdDB = "";

	@Override
	public void handle(HttpExchange httpExchange) throws IOException {
		String requestParamValue = null;
		if ("GET".equals(httpExchange.getRequestMethod())) {
			System.out.println("Peticion GET recibida: " + httpExchange);
			requestParamValue = handleGETRequest(httpExchange);
			handleGETResponse(httpExchange, requestParamValue);

		} else if ("POST".equals(httpExchange.getRequestMethod())) {
			requestParamValue = handlePostRequest(httpExchange);
			handlePOSTResponse(httpExchange, requestParamValue);
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////
	// 																					   //
	// PETICIONES POST 																	   //
	// 																					   //
	/////////////////////////////////////////////////////////////////////////////////////////

	private String handlePostRequest(HttpExchange httpExchange) {
		System.out.println("Recibida URI tipo POST: " + httpExchange.getRequestBody().toString());
		InputStream is = httpExchange.getRequestBody();
		InputStreamReader isr = new InputStreamReader(is);
		BufferedReader br = new BufferedReader(isr);
		StringBuilder sb = new StringBuilder();
		String line;
		

		try {
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
			br.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println(sb);
		return sb.toString();
	}

	private int handlePOSTResponse(HttpExchange httpExchange, String requestParamValue) throws IOException {

		System.out.println("POST: " + requestParamValue);
		String action = requestParamValue.split(",")[0];
		String info = requestParamValue.split(",")[1];
		String user = requestParamValue.split(",")[2];
		System.out.println("Action: " + action + "\nInfo: " + info + "\nUser: " + user);
		int outcome = 0;
		//String response = requestParamValue;
		//httpExchange.sendResponseHeaders(200, response.length());

		switch (action) {
		case "entry": {
			String timeStomp = new SimpleDateFormat("HH:mm").format(new java.util.Date());
			String dateStomp = new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
			System.out.println("Entrada de: " + user + "\nHora: " + timeStomp + "\nDia: " + dateStomp);
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				System.out.println("Lanzando consulta...");
				
				PreparedStatement psInsertar = con.prepareStatement("INSERT INTO checks (EmployeeID, Type, Date, Time) VALUES (?,?,?,?)");
				psInsertar.setString(1, user);
				psInsertar.setString(2, "Entry");
				psInsertar.setString(3, dateStomp);
				psInsertar.setString(4, timeStomp);
				int resultadoInsertar = psInsertar.executeUpdate();
				System.out.println("RS"+resultadoInsertar);
				con.close();
				if (resultadoInsertar == 1) {
					System.out.println("Se ha añadido la entrada con éxito");}
				
			} catch (Exception e) {
				System.out.println(e);
			}

		}break;
		case "exit": {
			String timeStomp = new SimpleDateFormat("HH:mm").format(new java.util.Date());
			String dateStomp = new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
			System.out.println("Entrada de: " + user + "\nHora: " + timeStomp + "\nDia: " + dateStomp);
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				System.out.println("Lanzando consulta...");
				
				PreparedStatement psInsertar = con.prepareStatement("INSERT INTO checks (EmployeeID, Type, Date, Time) VALUES (?,?,?,?)");
				psInsertar.setString(1, user);
				psInsertar.setString(2, "Exit");
				psInsertar.setString(3, dateStomp);
				psInsertar.setString(4, timeStomp);
				int resultadoInsertar = psInsertar.executeUpdate();
				System.out.println("RS"+resultadoInsertar);
				con.close();
				if (resultadoInsertar == 1) {
					System.out.println("Se ha añadido la entrada con éxito");}
				
			} catch (Exception e) {
				System.out.println(e);
			}

		}break;
		case "login": {
			;
			try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM registeredemployee WHERE EmployeeId = '" + user + "'");
			while (rs.next()) {
				String userDB = rs.getString(1);
				String pwd = rs.getString(3);
				if(user.equals(userDB) && info.equals(pwd)) {
					outcome = 15;
				}	else {
					outcome = 26;
				}
				return outcome;
			}
			rs.close();
			stmt.close();
			con.close();
			httpExchange.sendResponseHeaders(200, outcome);
			
			
			
			} catch (Exception e) {
				System.out.println(e);
			}

		}break;
		
		}
		return outcome;

	}
	
	
	public String convertToMd5(String passwrd) 
	  throws NoSuchAlgorithmException {
	    String password = passwrd;
	    MessageDigest md = MessageDigest.getInstance("MD5");
	    md.update(password.getBytes());
	    byte[] digest = md.digest();
	    String newpassword = digest.toString();
		return newpassword;
	}

	/////////////////////////////////////////////////////////////////////////////////////////
	// 																					   //
	// PETICIONES GET 																	   //
	// 																					   //
	/////////////////////////////////////////////////////////////////////////////////////////

	private String handleGETRequest(HttpExchange httpExchange) {
		String element = httpExchange.getRequestURI().toString().split("\\?")[1].split("=")[0];
		String request = httpExchange.getRequestURI().toString().split("\\?")[1].split("=")[1];
		System.out.println("GET Request: "+element+"--"+ request);
		

		switch (element) {
		case "login": {
			String usernameSentByApp = request.split(";")[0];
			String passwordSentByApp = request.split(";")[1];
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("SELECT * FROM registeredemployee WHERE Username = '" + usernameSentByApp + "'");
				while (rs.next()) {
					String username = rs.getString(2);
					String pwd = rs.getString(3);
					String outcome = "{\"Response\": \"NO\"}";
					//pwd = convertToMd5(pwd);
					
					if (usernameSentByApp.equals(username)&& passwordSentByApp.equals(pwd)) {
						outcome = "{\"response\": \"YES\"}";;
					}
										
					System.out.println("username:" + username);
					System.out.println("password:" + pwd);
					System.out.println("password:" + outcome);
					return outcome;
				}
				rs.close();
				stmt.close();
				con.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		case "userInfo": {
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("SELECT * FROM registeredemployee WHERE Username = '" + request + "'");
				while (rs.next()) {
					String employeeId = rs.getString(1);
					String username = rs.getString(2);
					String groupId = rs.getString(4);
					String office = rs.getString(5);
					String outcome = "{\"username\": \""+username+"\","
									+ "\"employeeID\": \""+employeeId+"\", "
									+ "\"group\": \""+groupId+"\","
									+ "\"office\": \""+office+"\"}";
					
					System.out.println("EmployeeID:" + employeeId);
					System.out.println("Username:" + username);
					System.out.println("Group:" + groupId);
					System.out.println("Office:" + office);
					
					return outcome;
				}
				rs.close();
				stmt.close();
				con.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		case "historic": {
			List<String> resultsQuery = new ArrayList<String>();
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("SELECT * FROM checks WHERE EmployeeID = '" + request + "'");
				while (rs.next()) {
					
					
					String employeeId = rs.getString("EmployeeId");
					String type = rs.getString("Type");
					String date = rs.getString("Date");
					String time = rs.getString("Time");
					time = time.substring(0,time.length() - 3);
					
					
					String outcome = "{\"type\": \""+type+"\","
							+ "\"employeeID\": \""+employeeId+"\", "
							+ "\"date\": \""+date+"\","
							+ "\"time\": \""+time+"\"}";
					resultsQuery.add(0,outcome);
					System.out.println("{\"historic\":"+resultsQuery.toString()+"}");
				}
				
				rs.close();
				stmt.close();
				con.close();
				return "{\"historic\":"+resultsQuery.toString()+"}";
			} catch (Exception e) {
				System.out.println(e);
			}
		}

		case "schedule": {
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection con = DriverManager.getConnection("jdbc:mysql://"+ip+":"+portDB+"/"+database, userDB, pwdDB);
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("SELECT * FROM hoursgroups WHERE groupID = '" + request + "'");
				while (rs.next()) {
					
					String Monday = rs.getString(2);
					String Tuesday = rs.getString(3);
					String Wednesday = rs.getString(4);
					String Thursday = rs.getString(5);
					String Friday = rs.getString(6);
					String Saturday = rs.getString(7);
					String Sunday = rs.getString(8);
					
					
					
					String outcome2 = "{\"schedule\": [\r\n"
							+ "{\r\n"
							+ "\"id\": \"1\",\r\n"
							+ "\"day\": \"Monday\",\r\n"
							+ "\"hours\": \""+Monday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"2\",\r\n"
							+ "\"day\": \"Tuesday\",\r\n"
							+ "\"hours\": \""+Tuesday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"3\",\r\n"
							+ "\"day\": \"Wednesday\",\r\n"
							+ "\"hours\": \""+Wednesday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"4\",\r\n"
							+ "\"day\": \"Thursday\",\r\n"
							+ "\"hours\": \""+Thursday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"5\",\r\n"
							+ "\"day\": \"Friday\",\r\n"
							+ "\"hours\": \""+Friday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"6\",\r\n"
							+ "\"day\": \"Saturday\",\r\n"
							+ "\"hours\": \""+Saturday+"\"\r\n"
							+ "},\r\n"
							+ "{\r\n"
							+ "\"id\": \"7\",\r\n"
							+ "\"day\": \"Sunday\",\r\n"
							+ "\"hours\": \""+Sunday+"\"\r\n"
							+ "}\r\n"
							+ "] }";
					
					System.out.println("Calendar:" + outcome2);
					System.out.println("\n\n//////////////HORARIOS DEL GRUPO"+request+"///////////////");
					System.out.println("monday:" + Monday);
					System.out.println("tuesday:" + Tuesday);
					System.out.println("wednesday:" + Wednesday);
					System.out.println("friday:" + Friday);
					System.out.println("saturday:" + Saturday);
					System.out.println("sunday:" + Sunday);
					return outcome2;
				}
				rs.close();
				stmt.close();
				con.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}try {
			httpExchange.sendResponseHeaders(200, request.length());
			httpExchange.getResponseBody().write(request.getBytes());
			httpExchange.getResponseBody().close();
		} catch (IOException e) {

		}
		}
		
		return request;
		

	}

	private void handleGETResponse(HttpExchange httpExchange, String requestParamValue) throws IOException {
		System.out.println("Peticion GET correcta");
		OutputStream outputStream = httpExchange.getResponseBody();
		String response = requestParamValue;
	
		httpExchange.sendResponseHeaders(200, response.length());
		outputStream.write(response.getBytes());
		outputStream.flush();
		outputStream.close();
	}
}
