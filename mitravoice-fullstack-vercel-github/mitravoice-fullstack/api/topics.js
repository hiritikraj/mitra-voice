const topics = [
  { id:'safety', title:'Safety rules', summary:'Use the safety equipment provided. Do not operate a machine if its guard is missing or it seems unsafe. Report hazards to a supervisor or trusted safety contact.' },
  { id:'wages', title:'Wages & overtime', summary:'Keep wage slips and note the days and hours you work. Check pay, overtime and deductions. Ask for an explanation if an amount is unclear.' },
  { id:'leave', title:'Leave & benefits', summary:'Ask for the workplace leave policy in a language you understand. Keep a record of leave requests and replies. Rules can vary by job and applicable law.' },
  { id:'dignity', title:'Harassment & dignity', summary:'Everyone deserves to work without threats, bullying or unwanted behaviour. You can record what happened and seek help from a trusted person or organisation.' },
  { id:'report', title:'How to report a problem', summary:'You can keep a private record, share an anonymous signal, or make a named complaint. Read who will see the information before choosing.' }
];
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  return res.status(200).json(topics);
}
