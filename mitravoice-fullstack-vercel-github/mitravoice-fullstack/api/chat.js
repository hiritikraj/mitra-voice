const answers = [
  { test: /wage|salary|pay|slip|overtime/i, answer: 'Keep a copy or photo of your wage slip. Check the days worked, basic pay, overtime hours and deductions. If something looks wrong, write down the date and amount and ask a trusted worker organisation for help.' },
  { test: /safety|machine|accident|injur/i, answer: 'Move away from immediate danger if you can do so safely. Tell the safety supervisor or a trusted person. Note the date, place and what happened. If someone is badly hurt, seek emergency medical help.' },
  { test: /harass|threat|abuse|touch/i, answer: 'You do not deserve to be harassed or threatened. If you feel unsafe, move to a safer place if possible. You can make a private note, share an anonymous signal, or seek support from a trusted organisation.' },
  { test: /leave|holiday|benefit/i, answer: 'Leave and benefit rules can depend on your workplace and applicable law. Keep written records of your request and any response. Ask your worker representative or a trusted local organisation to explain the rules that apply.' }
];
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const message = typeof req.body?.message === 'string' ? req.body.message.trim().slice(0, 2000) : '';
  if (!message) return res.status(400).json({ error: 'Please enter a question.' });
  const match = answers.find(x => x.test.test(message));
  const answer = match?.answer || 'I may not have the exact answer. You can save your concern privately or contact a trusted worker organisation for help. This prototype cannot provide legal advice.';
  return res.status(200).json({ answer });
}
