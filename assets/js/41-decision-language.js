/* ATHLETIC PHYSIQUE — Unified Decision Language v1
 * Internal engine enums remain stable; user-facing labels are unified.
 */
(function(){
  'use strict';
  const labels={
    progression:'Naikkan Progres',
    maintenance:'Pertahankan & Progres',
    volume_reduction:'Kurangi Volume',
    rotation:'Rotasi Gerakan',
    deload:'Deload / Pemulihan'
  };
  const descriptions={
    progression:'Performa sudah siap untuk peningkatan bertahap.',
    maintenance:'Pertahankan struktur latihan sambil melanjutkan progres kecil.',
    volume_reduction:'Kurangi volume untuk menjaga kualitas latihan dan mengendalikan fatigue.',
    rotation:'Ganti variasi gerakan yang stagnan sambil mempertahankan pola gerak.',
    deload:'Kurangi beban latihan sementara untuk memulihkan performa.'
  };
  window.apDecisionLanguage={
    label:a=>labels[String(a||'').toLowerCase()]||'Evaluasi',
    description:a=>descriptions[String(a||'').toLowerCase()]||'',
    labels:Object.freeze({...labels}),
    descriptions:Object.freeze({...descriptions})
  };
  document.documentElement.dataset.decisionLanguage='unified-v1';
})();
