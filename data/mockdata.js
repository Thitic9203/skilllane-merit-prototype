// Mock data for SkillLane Merit prototype

// User registry — keyed by authorized email
window.MERIT_USERS = {
  'thitichaya.c@skilllane.com': {
    id: 'u1',
    name: 'Thitichaya Chaiyaporn',
    firstName: 'Thitichaya',
    role: 'Team Lead QA Engineer',
    team: 'Quality Engineering',
    email: 'thitichaya.c@skilllane.com',
    balance: 4820,
    lifetime: 18340,
    rank: 7,
    rankDeltaYoY: 2,
    avatarInitials: 'TC',
    avatarTone: 'gold',
    joined: 'March 2023',
    isAdmin: true,
    badges: [
      { id: 'b1', name: 'Five-Year Mark',  earned: 'Mar 2028', kind: 'tenure' },
      { id: 'b2', name: 'Mentor',          earned: 'Nov 2025', kind: 'peer' },
      { id: 'b3', name: 'Launch Captain',  earned: 'Aug 2025', kind: 'milestone' },
      { id: 'b4', name: 'Top 10 — Q1',    earned: 'Apr 2026', kind: 'quarter' },
    ],
  },
  'somsak.c@skilllane.com': {
    id: 'u4',
    name: 'Somsak Chan',
    firstName: 'Somsak',
    role: 'Senior Software Engineer',
    team: 'Engineering',
    email: 'somsak.c@skilllane.com',
    balance: 5640,
    lifetime: 22180,
    rank: 4,
    rankDeltaYoY: 1,
    avatarInitials: 'SC',
    avatarTone: 'navy',
    joined: 'January 2021',
    isAdmin: false,
    badges: [
      { id: 'b5', name: 'Four-Year Mark',  earned: 'Jan 2025', kind: 'tenure' },
      { id: 'b6', name: 'Incident Shield', earned: 'Sep 2025', kind: 'milestone' },
      { id: 'b7', name: 'Top 10 — Q1',    earned: 'Apr 2026', kind: 'quarter' },
    ],
  },
};

window.MERIT_DATA = {
  currentUser: {
    id: 'u1',
    name: 'Thitichaya Chaiyaporn',
    role: 'Team Lead QA Engineer',
    team: 'Quality Engineering',
    balance: 4820,
    lifetime: 18340,
    rank: 7,
    rankDeltaYoY: 2,
    avatarInitials: 'TC',
    avatarTone: 'gold',
    joined: 'March 2023',
    isAdmin: true,
    badges: [
      { id: 'b1', name: 'Five-Year Mark', earned: 'Mar 2028', kind: 'tenure' },
      { id: 'b2', name: 'Mentor', earned: 'Nov 2025', kind: 'peer' },
      { id: 'b3', name: 'Launch Captain', earned: 'Aug 2025', kind: 'milestone' },
      { id: 'b4', name: 'Top 10 — Q1', earned: 'Apr 2026', kind: 'quarter' },
    ],
  },

  leaderboard: [
    { rank: 1, name: 'Kittipat Wongsa',       team: 'Engineering',          points: 7420, monthlyPts: 1280, initials: 'KW' },
    { rank: 2, name: 'Nattapong S.',           team: 'Sales',                points: 6980, monthlyPts: 1140, initials: 'NS' },
    { rank: 3, name: 'Pimchanok Ruang',        team: 'Customer Ops',         points: 6210, monthlyPts:  980, initials: 'PR' },
    { rank: 4, name: 'Somsak Chan',            team: 'Engineering',          points: 5640, monthlyPts:  820, initials: 'SC' },
    { rank: 5, name: 'Benjamas L.',            team: 'Marketing',            points: 5180, monthlyPts:  740, initials: 'BL' },
    { rank: 6, name: 'Rujira Thana',           team: 'People Ops',           points: 4920, monthlyPts:  690, initials: 'RT' },
    { rank: 7, name: 'Thitichaya Chaiyaporn',  team: 'Quality Engineering',  points: 4820, monthlyPts:  620, initials: 'TC', isYou: true },
    { rank: 8, name: 'Chaiyaphum M.',          team: 'Finance',              points: 4560, monthlyPts:  570, initials: 'CM' },
    { rank: 9, name: 'Suda Kanchanan',         team: 'Legal',                points: 4320, monthlyPts:  490, initials: 'SK' },
    { rank:10, name: 'Pakorn Visedchaisri',    team: 'Engineering',          points: 4110, monthlyPts:  430, initials: 'PV' },
  ],

  activity: [
    { id: 't1', type: 'earned',    amount: 250, category: 'Shipped Work', note: 'Design system v3 launch — incredible leadership',   from: 'Pichet R. (Head of Design)', when: '2h ago',    date: 'Apr 19, 2026' },
    { id: 't2', type: 'peer',      amount: 50,  category: 'Peer Recognition', note: 'Thanks for the late-night review on the pricing flow',        from: 'Somsak Chan',                 when: 'Yesterday',  date: 'Apr 18, 2026' },
    { id: 't3', type: 'redeemed',  amount: -1200, category: 'Reward', note: 'Redeemed: Herman Miller chair voucher',                                from: 'Rewards Catalog',             when: '3d ago',     date: 'Apr 16, 2026' },
    { id: 't4', type: 'earned',    amount: 120, category: 'Milestone', note: 'Three years at SkillLane',                                            from: 'People Ops (automatic)',      when: 'Apr 1',      date: 'Apr 1, 2026'  },
    { id: 't5', type: 'peer',      amount: 30,  category: 'Peer Recognition', note: 'Great mentorship on the new hire onboarding',                 from: 'Benjamas L.',                 when: 'Mar 29',     date: 'Mar 29, 2026' },
    { id: 't6', type: 'earned',    amount: 180, category: 'Above & Beyond', note: 'Stepped in on the Bangkok customer escalation',                 from: 'Kittipat Wongsa',             when: 'Mar 22',     date: 'Mar 22, 2026' },
    { id: 't7', type: 'redeemed',  amount: -600, category: 'Reward', note: 'Redeemed: Full-day wellness retreat',                                   from: 'Rewards Catalog',             when: 'Mar 14',     date: 'Mar 14, 2026' },
    { id: 't8', type: 'peer',      amount: 25,  category: 'Peer Recognition', note: 'Thanks for covering office hours',                            from: 'Rujira Thana',                when: 'Mar 8',      date: 'Mar 8, 2026'  },
    { id: 't9', type: 'earned',    amount: 300, category: 'Shipped Work', note: 'Q1 research program delivery',                                    from: 'Pichet R. (Head of Design)',  when: 'Feb 28',     date: 'Feb 28, 2026' },
  ],

  rewards: [
    { id: 'r1',  title: 'Herman Miller Aeron — voucher',    category: 'Office',    cost: 1200, stock: 'In stock',  tag: 'Most redeemed' },
    { id: 'r2',  title: 'Full-day wellness retreat',         category: 'Wellness',  cost: 600,  stock: '8 left',    tag: null },
    { id: 'r3',  title: 'Premium learning budget ($500)',   category: 'Growth',    cost: 450,  stock: 'Unlimited', tag: 'Staff pick' },
    { id: 'r4',  title: 'Sony WH-1000XM6 headphones',       category: 'Tech',      cost: 950,  stock: '12 left',   tag: null },
    { id: 'r5',  title: 'Dinner for two — omakase',         category: 'Experience',cost: 780,  stock: 'On request',tag: null },
    { id: 'r6',  title: 'Home office upgrade — $800',       category: 'Office',    cost: 1600, stock: 'In stock',  tag: null },
    { id: 'r7',  title: 'Charity donation match',           category: 'Give back', cost: 200,  stock: 'Unlimited', tag: null },
    { id: 'r8',  title: 'Extra vacation day',               category: 'Time',      cost: 1400, stock: '1 per yr',  tag: 'New' },
    { id: 'r9',  title: 'Conference pass — Config 2026',    category: 'Growth',    cost: 2200, stock: '3 left',    tag: null },
  ],

  recognitions: [
    {
      id: 'rec1',
      fromName: 'Somsak Chan', fromInitials: 'SC',
      toName: 'Thitichaya Chaiyaporn', toInitials: 'TC',
      message: 'Late-night review on the pricing flow saved us a full sprint. The annotations were the clearest I have ever seen in Figma.',
      category: 'Peer recognition', amount: 50,
      reactions: { '👏': 12, '🙏': 4, '🔥': 7 },
      when: '2 hours ago',
    },
    {
      id: 'rec2',
      fromName: 'Kittipat Wongsa', fromInitials: 'KW',
      toName: 'Rujira Thana', toInitials: 'RT',
      message: 'Thank you for running the new-hire cohort entirely by yourself while I was at the Singapore summit.',
      category: 'Above & beyond', amount: 120,
      reactions: { '👏': 28, '❤️': 9, '🙏': 6 },
      when: '5 hours ago',
    },
    {
      id: 'rec3',
      fromName: 'Benjamas L.', fromInitials: 'BL',
      toName: 'Nattapong S.', toInitials: 'NS',
      message: 'Closing the Phuket enterprise deal on the original timeline was masterful. The prep document was a model everyone on the team should study.',
      category: 'Shipped work', amount: 200,
      reactions: { '👏': 41, '🎯': 14, '🔥': 18 },
      when: 'Yesterday',
    },
    {
      id: 'rec4',
      fromName: 'Pimchanok Ruang', fromInitials: 'PR',
      toName: 'Somsak Chan', toInitials: 'SC',
      message: 'The incident response runbook you wrote last quarter was referenced three times this week. Quiet work that pays off.',
      category: 'Peer recognition', amount: 40,
      reactions: { '🙏': 22, '📘': 9 },
      when: '2 days ago',
    },
  ],

  teamDashboard: {
    headline: { awardedThisMonth: 18420, recognitions: 247, activeParticipants: 188, totalHeadcount: 232 },
    // 12 weeks of awarded points for sparkline/line chart
    trend: [820, 910, 780, 1040, 1180, 1360, 1220, 1540, 1610, 1720, 1860, 2100],
    categoryBreakdown: [
      { label: 'Shipped Work',     value: 38 },
      { label: 'Peer Recognition', value: 27 },
      { label: 'Above & Beyond',   value: 19 },
      { label: 'Milestone',        value: 11 },
      { label: 'Other',            value: 5  },
    ],
    topPerformers: [
      { name: 'Kittipat W.', team: 'Engineering', delta: 1280, initials: 'KW' },
      { name: 'Nattapong S.', team: 'Sales',       delta: 1140, initials: 'NS' },
      { name: 'Pimchanok R.', team: 'Customer Ops',delta: 980,  initials: 'PR' },
      { name: 'Somsak C.',    team: 'Engineering', delta: 820,  initials: 'SC' },
    ],
  },

  recipients: [
    { id: 'p1', name: 'Somsak Chan',        team: 'Engineering',   initials: 'SC' },
    { id: 'p2', name: 'Benjamas Luangsa',   team: 'Marketing',     initials: 'BL' },
    { id: 'p3', name: 'Kittipat Wongsa',    team: 'Engineering',   initials: 'KW' },
    { id: 'p4', name: 'Rujira Thana',       team: 'People Ops',    initials: 'RT' },
    { id: 'p5', name: 'Pimchanok Ruang',    team: 'Customer Ops',  initials: 'PR' },
    { id: 'p6', name: 'Chaiyaphum M.',      team: 'Finance',       initials: 'CM' },
  ],

  categories: ['Shipped Work', 'Above & Beyond', 'Peer Recognition', 'Milestone', 'Learning'],

  notifications: [
    { id: 'n1', kind: 'recognition', unread: true,  fromName: 'Pichet R.',     fromInitials: 'PR', fromTone: 'navy',  title: 'Pichet R. recognized you',                   body: 'Design system v3 launch — incredible leadership.',                                        amount: 250, category: 'Shipped Work',     when: '2h ago',   group: 'today' },
    { id: 'n2', kind: 'redemption',  unread: true,  fromName: 'Rewards Team',  fromInitials: 'RT', fromTone: 'gold',  title: 'Your reward is on the way',                  body: 'Herman Miller chair voucher has been approved. Expect an email with the voucher code within 24h.', when: '5h ago',   group: 'today' },
    { id: 'n3', kind: 'reaction',    unread: true,  fromName: 'Somsak C. + 6', fromInitials: 'SC', fromTone: 'slate', title: '7 people reacted to your recognition',       body: '“Late-night review on the pricing flow…”',                                                when: '6h ago',   group: 'today' },
    { id: 'n4', kind: 'system',      unread: false,                             fromInitials: 'M',  fromTone: 'navy',  title: 'Quarter closes in 72 days',                  body: 'Unspent points above 1,000 will not carry over. Browse the rewards catalog.',             when: 'Yesterday',group: 'earlier' },
    { id: 'n5', kind: 'recognition', unread: false, fromName: 'Benjamas L.',   fromInitials: 'BL', fromTone: 'slate', title: 'Benjamas L. recognized you',                 body: 'Great mentorship on the new hire onboarding.',                                            amount: 30, category: 'Peer Recognition', when: '2d ago',   group: 'earlier' },
    { id: 'n6', kind: 'badge',       unread: false,                             fromInitials: '✦',  fromTone: 'gold',  title: 'You earned a badge — Top 10, Q1',           body: 'Ranked #7 out of 232 teammates. Congrats.',                                               when: 'Apr 3',    group: 'earlier' },
    { id: 'n7', kind: 'system',      unread: false,                             fromInitials: 'M',  fromTone: 'navy',  title: 'New rewards added to the catalog',          body: '3 experiences and 2 tech items are newly available.',                                     when: 'Mar 28',   group: 'earlier' },
  ],

  searchSuggestions: {
    recent: ['Pichet R.', 'wellness retreat', 'pricing flow', 'design system v3'],
    quickActions: [
      { id: 'qa1', label: 'Review pending approvals', icon: 'send',     screen: 'approve',     admin: true },
      { id: 'qa2', label: 'Redeem a reward',          icon: 'gift',     screen: 'rewards' },
      { id: 'qa3', label: 'Log an activity',          icon: 'history',  screen: 'history' },
      { id: 'qa4', label: 'View leaderboard',         icon: 'medal',    screen: 'leaderboard' },
    ],
  },
};
