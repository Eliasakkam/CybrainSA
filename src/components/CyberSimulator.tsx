import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface SimulatorProps {
  onClose: () => void;
}

export function CyberSimulator({ onClose }: SimulatorProps) {
  const [currentOS, setCurrentOS] = useState<"kali" | "ubuntu" | "windows">("kali");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to Kali Linux Simulator",
    "Type 'help' for available commands",
    ""
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [currentDirectory, setCurrentDirectory] = useState("/home/kali");
  const terminalRef = useRef<HTMLDivElement>(null);

  const availableCommands = {
    help: "عرض الأوامر المتاحة",
    ls: "عرض محتويات المجلد",
    cd: "تغيير المجلد",
    pwd: "عرض المجلد الحالي",
    nmap: "فحص الشبكة والمنافذ",
    sqlmap: "اختبار ثغرات SQL Injection",
    nikto: "فحص ثغرات الويب",
    metasploit: "إطار عمل الاختراق",
    wireshark: "تحليل حركة الشبكة",
    john: "كسر كلمات المرور",
    hashcat: "كسر التشفير",
    aircrack: "اختبار أمان WiFi",
    clear: "مسح الشاشة",
    whoami: "عرض المستخدم الحالي",
    ifconfig: "عرض إعدادات الشبكة",
    netstat: "عرض اتصالات الشبكة",
    ps: "عرض العمليات الجارية",
    top: "مراقب النظام",
    cat: "عرض محتوى الملف",
    nano: "محرر النصوص",
    grep: "البحث في النصوص",
    find: "البحث عن الملفات",
    chmod: "تغيير صلاحيات الملفات",
    sudo: "تنفيذ بصلاحيات المدير",
    elias207: " رسالة مخفية"
  };

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = "";

    switch (command) {
      case "help":
        output = "الأوامر المتاحة:\n" + 
          Object.entries(availableCommands)
            .map(([cmd, desc]) => `${cmd.padEnd(12)} - ${desc}`)
            .join("\n");
        break;

      case "ls":
        if (currentDirectory === "/home/kali") {
          output = "Desktop  Documents  Downloads  Pictures  Tools  Scripts";
        } else if (currentDirectory === "/home/kali/Tools") {
          output = "nmap  sqlmap  nikto  metasploit  wireshark  john  hashcat  aircrack-ng";
        } else {
          output = "file1.txt  file2.txt  directory1  directory2";
        }
        break;

      case "pwd":
        output = currentDirectory;
        break;

      case "cd":
        if (args.length === 0) {
          setCurrentDirectory("/home/kali");
          output = "";
        } else if (args[0] === "Tools" && currentDirectory === "/home/kali") {
          setCurrentDirectory("/home/kali/Tools");
          output = "";
        } else if (args[0] === ".." && currentDirectory !== "/") {
          setCurrentDirectory("/home/kali");
          output = "";
        } else {
          output = `cd: ${args[0]}: No such file or directory`;
        }
        break;

      case "whoami":
        output = "kali";
        break;

      case "ifconfig":
        output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)`;
        break;

      case "nmap":
        if (args.length === 0) {
          output = "Usage: nmap [target]\nExample: nmap 192.168.1.1";
        } else {
          output = `Starting Nmap scan on ${args[0]}...
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql

Nmap scan completed.`;
        }
        break;

      case "sqlmap":
        if (args.length === 0) {
          output = "Usage: sqlmap -u [URL]\nExample: sqlmap -u http://example.com/login.php";
        } else {
          output = `SQLMap v1.7.2
Testing SQL injection on ${args.includes("-u") ? args[args.indexOf("-u") + 1] : "target"}...
[INFO] Testing MySQL injection
[CRITICAL] SQL injection vulnerability found!
Parameter: username (POST)
Type: boolean-based blind`;
        }
        break;

      case "nikto":
        output = `Nikto Web Scanner v2.5.0
Scanning ${args[0] || "target"}...
+ Server: Apache/2.4.41
+ Retrieved x-powered-by header: PHP/7.4.3
+ The anti-clickjacking X-Frame-Options header is not present.
+ Uncommon header 'x-ob_mode' found, with contents: 1
+ /admin/: Admin login page/section found.`;
        break;

      case "metasploit":
        output = `Metasploit Framework Console
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > set LHOST 192.168.1.100
msf6 exploit(multi/handler) > exploit`;
        break;

      case "wireshark":
        output = `Starting Wireshark packet capture...
Capturing on interface eth0
Packets captured: 1,247
HTTP requests: 45
HTTPS requests: 89
DNS queries: 156`;
        break;

      case "john":
        output = `John the Ripper password cracker
Loaded 1 password hash (MD5)
Proceeding with wordlist attack...
admin123         (user1)
password         (user2)
Session completed`;
        break;

      case "hashcat":
        output = `Hashcat v6.2.6
Attempting to crack MD5 hash...
5d41402abc4b2a76b9719d911017c592:hello
Session..........: hashcat
Status...........: Cracked`;
        break;

      case "aircrack":
        output = `Aircrack-ng 1.7
Reading packets from capture.cap...
Networks found: 3
WPA handshakes: 1
Attempting dictionary attack...
KEY FOUND! [ password123 ]`;
        break;

      case "netstat":
        output = `Active Internet connections
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 192.168.1.100:45678     192.168.1.1:80          ESTABLISHED`;
        break;

      case "ps":
        output = `  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 5678 pts/0    00:00:00 nmap
 9012 pts/0    00:00:00 ps`;
        break;

      case "clear":
        setTerminalHistory([]);
        return;

      case "cat":
        if (args.length === 0) {
          output = "Usage: cat [filename]";
        } else {
          output = `Contents of ${args[0]}:
This is a sample file content.
It contains some text for demonstration.
End of file.`;
        }
        break;

      case "elias207":
        if (args.length === 0) {
          output = `🔒 هل اكتشفت السر؟

إذا كنت تقرأ هذه الرسالة، فأنت من القلائل الذين لاحظوا أن هذا المحاكي تجريبي فقط، تم تصميمه لمنحك لمحة أولية عن تجربة الاستخدام.

لكن لا تقلق…
المحاكي الحقيقي قادم قريباً، وسيكون مختلفاً تماماً – أكثر واقعية، أسرع، وأقرب ما يكون إلى التجربة الحقيقية.

تابعنا، فالقادم يستحق الانتظار.`;
        } else {
          output = `🔒 الرسالة السرية: ${args.join(" ")}`;
        }
        break;

      default:
        if (command) {
          output = `bash: ${command}: command not found`;
        }
        break;
    }

    const newHistory = [
      ...terminalHistory,
      `${currentDirectory}$ ${cmd}`,
      output,
      ""
    ];
    setTerminalHistory(newHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const osConfigs = {
    kali: {
      name: "Kali Linux",
      color: "from-green-600 to-green-800",
      prompt: "kali@kali",
      icon: "🐉"
    },
    ubuntu: {
      name: "Ubuntu Server",
      color: "from-orange-600 to-orange-800", 
      prompt: "ubuntu@server",
      icon: "🐧"
    },
    windows: {
      name: "Windows 10",
      color: "from-blue-600 to-blue-800",
      prompt: "C:\\Users\\Admin",
      icon: "🪟"
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${osConfigs[currentOS].color} p-4 rounded-t-lg flex justify-between items-center`}>
          <div className="flex items-center gap-4">
            <span className="text-2xl">{osConfigs[currentOS].icon}</span>
            <h2 className="text-white font-bold text-xl">محاكي {osConfigs[currentOS].name}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={currentOS}
              onChange={(e) => setCurrentOS(e.target.value as any)}
              className="bg-black/20 text-white border border-white/30 rounded px-3 py-1"
            >
              <option value="kali">Kali Linux</option>
              <option value="ubuntu">Ubuntu Server</option>
              <option value="windows">Windows 10</option>
            </select>
            
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div 
          ref={terminalRef}
          className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto"
        >
          {terminalHistory.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          
          <div className="flex items-center">
            <span className="text-green-400">{osConfigs[currentOS].prompt}:~$ </span>
            <input
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent text-green-400 outline-none flex-1 ml-1"
              autoFocus
              placeholder="اكتب أمر..."
            />
          </div>
        </div>

        {/* Quick Commands */}
        <div className="border-t border-green-500 p-4 bg-gray-900">
          <div className="text-green-400 text-sm mb-2">أوامر سريعة:</div>
          <div className="flex flex-wrap gap-2">
            {["nmap 192.168.1.1", "sqlmap -u http://target.com", "nikto -h target.com", "help", "clear", "elias207"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setCurrentCommand(cmd);
                  executeCommand(cmd);
                  setCurrentCommand("");
                }}
                className="bg-green-600/20 hover:bg-green-600/40 text-green-400 px-3 py-1 rounded text-xs border border-green-500/30"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
