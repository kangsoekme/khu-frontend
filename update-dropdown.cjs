const fs = require('fs');
const path = 'C:/Users/PC_24/Documents/sj/project/FRONT END/src/pages/direktur/LaporanManagement.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject Popover imports
if (!content.includes('Popover')) {
  content = content.replace(
    'import { Button } from "@/components/ui/button";',
    'import { Button } from "@/components/ui/button";\nimport { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";\nimport { FaSearch } from "react-icons/fa";'
  );
}

// 2. Inject state variables
if (!content.includes('searchStudent')) {
  content = content.replace(
    'const [selectedNis, setSelectedNis] = useState("");',
    'const [selectedNis, setSelectedNis] = useState("");\n  const [searchStudent, setSearchStudent] = useState("");\n  const [openStudentPopover, setOpenStudentPopover] = useState(false);'
  );
}

// 3. Inject derived state
if (!content.includes('filteredStudents')) {
  content = content.replace(
    'const students = studentsRes?.data || [];',
    'const students = studentsRes?.data || [];\n  const filteredStudents = students.filter(s => s.nama.toLowerCase().includes(searchStudent.toLowerCase()) || s.nis.includes(searchStudent));'
  );
}

// 4. Replace Select with Popover
const oldSelectBlock = `<Select value={selectedNis} onValueChange={setSelectedNis}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Pilih Siswa..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.nis} value={s.nis} className="text-xs">
                      {s.nis} - {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>`;

const newPopoverBlock = `<Popover open={openStudentPopover} onOpenChange={setOpenStudentPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-9 justify-start text-xs font-normal border-neutral-300">
                    {selectedNis 
                      ? \`\${selectedNis} - \${students.find(s => s.nis === selectedNis)?.nama || ""}\` 
                      : "Pilih Siswa..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <div className="flex flex-col gap-1 p-2">
                    <div className="relative">
                      <FaSearch className="absolute left-2.5 top-2.5 h-3 w-3 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="Cari NIS / Nama..." 
                        className="h-8 w-full pl-8 pr-3 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" 
                        value={searchStudent} 
                        onChange={e => setSearchStudent(e.target.value)} 
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto flex flex-col mt-1 scrollbar-thin">
                      {filteredStudents.length > 0 ? filteredStudents.map(s => (
                         <div 
                           key={s.nis} 
                           className="p-2 text-xs hover:bg-neutral-100 cursor-pointer rounded text-left transition-colors" 
                           onClick={() => { 
                             setSelectedNis(s.nis); 
                             setOpenStudentPopover(false); 
                             setSearchStudent("");
                           }}
                         >
                           {s.nis} - {s.nama}
                         </div>
                      )) : <div className="p-2 text-xs text-neutral-500 text-center">Tidak ditemukan</div>}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>`;

content = content.replace(oldSelectBlock, newPopoverBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
