/* eslint-disable @next/next/no-img-element */
import { SiteHeader } from "@/app/components/site-header";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-copy">
          <div className="landing-kicker">برنامج تدريبي قيادي متكامل</div>
          <h1>دورة القيادة التحويلية</h1>
          <p className="hero-subtitle">
            من قائدٍ يُدير المهام... إلى قائدٍ يصنع الأثر.
          </p>
          <div className="hero-actions" style={{ marginTop: '32px' }}>
            <a href="#register" className="primary-link" style={{ padding: '14px 28px', fontSize: '18px' }}>
              سجل الآن
            </a>
            <a href="#curriculum" className="secondary-link" style={{ padding: '14px 28px', fontSize: '18px' }}>
              استعرض المحاور
            </a>
          </div>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '24px', alignItems: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-3)' }}>التاريخ</span>
                <strong style={{ color: 'var(--navy)' }}>24 محرم 1448 هـ / 9 يوليو 2026 م</strong>
             </div>
          </div>
        </div>

        <div className="hero-media">
          <img src="/brand/dr-mohammad.jpg" alt="د. محمد أبوزيد" />
          <div className="trainer-name-card">
            <span>إعداد وتقديم</span>
            <strong>د. محمد أبوزيد</strong>
            <small>خبير استراتيجي ومدرب قيادي</small>
          </div>
        </div>
      </section>

      {/* The Leadership Gap */}
      <section className="landing-section landing-section-alt" id="gap">
        <div className="section-heading" style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto 40px' }}>
           <div className="landing-kicker">القيادة التحويلية بالأرقام</div>
           <h2 className="landing-title" style={{ margin: '0 auto' }}>القيادة التحويلية ضرورة لا رفاهية</h2>
           <p className="landing-subtitle" style={{ margin: '16px auto 0' }}>
              الفجوة بين الأداء الفعلي والأداء الممكن في أغلب المؤسسات العربية ليست فجوة موارد، بل فجوة قيادة.
           </p>
        </div>
        <div className="stats-grid">
           <div className="stat-card">
              <span className="stat-value">+70%</span>
              <p className="stat-label">من مبادرات التحوّل المؤسسي تفشل بسبب القيادة والثقافة، لا بسبب الاستراتيجية.</p>
           </div>
           <div className="stat-card">
              <span className="stat-value">48%</span>
              <p className="stat-label">من الرؤساء التنفيذيين في الشرق الأوسط يرون أن مؤسساتهم لن تستمر دون تحوّل جوهري.</p>
           </div>
           <div className="stat-card">
              <span className="stat-value">23%</span>
              <p className="stat-label">ارتفاع في الأداء الفردي للموظفين تحت قيادة تحويلية مقارنة بالقيادة التقليدية.</p>
           </div>
           <div className="stat-card">
              <span className="stat-value">19%</span>
              <p className="stat-label">زيادة في &quot;الجهد التطوعي&quot; الذي يقدّمه الموظف فوق ما تتطلبه وظيفته.</p>
           </div>
        </div>
      </section>

      {/* Traditional vs Transformational */}
      <section className="landing-section" id="comparison">
         <div className="section-heading">
            <div className="landing-kicker">الفكرة ولماذا الآن؟</div>
            <h2 className="landing-title">القيادة التقليدية لم تعد كافية</h2>
            <p className="landing-subtitle">
               تعيش المؤسسات العربية تحولاً تاريخياً. لم يعد يكفي أن يُدير القائد العمليات بكفاءة، بل أصبح مطلوباً منه أن يُلهم، ويُحوّل، ويبني مؤسسات قادرة على الازدهار باستدامة وسط التعقيد.
            </p>
         </div>

         <div className="comparison-grid">
            <div className="comparison-column">
               <h3 className="comparison-header">القيادة التقليدية</h3>
               <p style={{ color: 'var(--text-3)', marginBottom: '24px', fontStyle: 'italic' }}>تسأل: &quot;كيف ومتى ننجز المهمة؟&quot;</p>
               <div className="comparison-item">
                  <h4>السلطة</h4>
                  <p>مستمدة من الموقع الوظيفي وحده</p>
               </div>
               <div className="comparison-item">
                  <h4>التحفيز</h4>
                  <p>عبر الأنظمة والحوافز والرقابة</p>
               </div>
               <div className="comparison-item">
                  <h4>التغيير</h4>
                  <p>التعامل مع التغيير كاستثناء يُدار بحذر</p>
               </div>
               <div className="comparison-item">
                  <h4>النتيجة</h4>
                  <p>امتثال يلتزم بحدود الوصف الوظيفي</p>
               </div>
            </div>

            <div className="comparison-column transformational">
               <h3 className="comparison-header">القيادة التحويلية</h3>
               <p style={{ color: 'var(--gold)', marginBottom: '24px', fontStyle: 'italic' }}>تسأل: &quot;من نريد أن نكون، وما الأثر الذي نتركه؟&quot;</p>
               <div className="comparison-item">
                  <h4>السلطة</h4>
                  <p>مستمدة من الأثر والمصداقية والقدوة</p>
               </div>
               <div className="comparison-item">
                  <h4>التحفيز</h4>
                  <p>عبر المعنى والانتماء والنمو الشخصي</p>
               </div>
               <div className="comparison-item">
                  <h4>التغيير</h4>
                  <p>قيادة التغيير والابتكار كأسلوب عمل دائم</p>
               </div>
               <div className="comparison-item">
                  <h4>النتيجة</h4>
                  <p>التزام حقيقي يتجاوز وصف الوظيفة</p>
               </div>
            </div>
         </div>
      </section>

      {/* The Pillars (What You'll Learn) */}
      <section className="landing-section landing-section-alt" id="pillars">
         <div className="section-heading" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
            <div className="landing-kicker">أهداف الدورة</div>
            <h2 className="landing-title" style={{ margin: '0 auto' }}>التحول الحقيقي يحتاج إلى قائد يستطيع أن يجمع بين:</h2>
         </div>
         <div className="cards-grid">
            <div className="feature-card">
               <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
               </div>
               <h3>المعنى</h3>
               <p>صياغة رؤية تلهم وتوجّه السلوك.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
               </div>
               <h3>النظام</h3>
               <p>تحويل الجهود الفردية إلى قدرات مؤسسية.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               </div>
               <h3>الإنسان</h3>
               <p>بناء الثقة، والدافعية، والانخراط.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               </div>
               <h3>التغيير</h3>
               <p>قيادة التحولات في بيئات معقدة وغير مستقرة.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"/></svg>
               </div>
               <h3>الذكاء الاصطناعي</h3>
               <p>استخدام الأدوات الرقمية لتوسيع التفكير وتسريع القرار.</p>
            </div>
         </div>
      </section>

      {/* Curriculum */}
      <section className="landing-section" id="curriculum">
         <div className="section-heading">
            <div className="landing-kicker">البرنامج العلمي</div>
            <h2 className="landing-title">محاور الدورة</h2>
            <p className="landing-subtitle">
               محاور متتابعة تأخذ المشارك من الأساسيات النظرية إلى القدرة على قياس الأثر المؤسسي.
            </p>
         </div>

         <div className="timeline">
            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 00</span>
                  <h3 className="timeline-title">مفاهيم القيادة</h3>
                  <p className="timeline-desc">المبادئ الأساسية للقيادة، تعريفات القيادة، أساليب القيادة، النظريات والقوانين الحاكمة.</p>
               </div>
            </div>
            
            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 01</span>
                  <h3 className="timeline-title">أساسيات القيادة التحويلية ونموذج الأركان الأربعة</h3>
                  <p className="timeline-desc">مفهوم القيادة التحويلية، الفرق بينها وبين الكلاسيكية، لماذا نحتاجها اليوم، وتطبيق نموذج 4I&apos;s في بيئة العمل.</p>
               </div>
            </div>

            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 02</span>
                  <h3 className="timeline-title">الرؤية والإلهام وصناعة المعنى</h3>
                  <p className="timeline-desc">بناء رؤية مؤسسية ملهمة، مواءمة الغايات الفردية والمؤسسية، فن سرد القصة القيادية الملهمة لتحفيز الالتزام.</p>
               </div>
            </div>

            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 03</span>
                  <h3 className="timeline-title">قيادة التغيير والابتكار المؤسسي</h3>
                  <p className="timeline-desc">تمكين القائد في بيئات معقدة (VUCA). مهارات التغيير، إدارة المقاومة، وتصميم مبادرات قابلة للتنفيذ.</p>
               </div>
            </div>

            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 04</span>
                  <h3 className="timeline-title">الذكاء العاطفي وبناء فرق عالية الأداء</h3>
                  <p className="timeline-desc">أبعاد الذكاء العاطفي الأربعة للقائد، القائد كمدرب (Leader as Coach)، التمكين، وبناء الثقة المؤسسية.</p>
               </div>
            </div>

            <div className="timeline-item">
               <div className="timeline-dot"></div>
               <div className="timeline-content">
                  <span className="timeline-module">المحور 05</span>
                  <h3 className="timeline-title">القيادة المتقدمة والأثر المؤسسي المستدام</h3>
                  <p className="timeline-desc">تثبيت التغيير، توزيع القدرة القيادية باستخدام إطار +CAPS من MIT، قياس أثر القيادة، وخطة العمل لـ 90 يوماً.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Methodology & Target Audience */}
      <section className="landing-section landing-section-alt" id="methodology">
         <div className="comparison-grid" style={{ marginTop: 0 }}>
            <div>
               <div className="landing-kicker">لمن هذه الدورة؟</div>
               <h2 className="landing-title" style={{ fontSize: '28px' }}>صُممت لتطوير واقع المؤسسات بشقّيها الحكومي والخاص</h2>
               <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="feature-card" style={{ padding: '20px' }}>
                     <h3 style={{ fontSize: '18px', color: 'var(--navy)' }}>القيادات التنفيذية ومدراء الإدارات</h3>
                  </div>
                  <div className="feature-card" style={{ padding: '20px' }}>
                     <h3 style={{ fontSize: '18px', color: 'var(--navy)' }}>قيادات القطاع الخاص والشركات</h3>
                  </div>
                  <div className="feature-card" style={{ padding: '20px' }}>
                     <h3 style={{ fontSize: '18px', color: 'var(--navy)' }}>مدراء التحوّل المؤسسي وإدارة التغيير</h3>
                  </div>
                  <div className="feature-card" style={{ padding: '20px' }}>
                     <h3 style={{ fontSize: '18px', color: 'var(--navy)' }}>فرق الموارد البشرية وتطوير القيادات</h3>
                  </div>
               </div>
            </div>

            <div>
               <div className="landing-kicker">منهجية التدريب</div>
               <h2 className="landing-title" style={{ fontSize: '28px' }}>تجمع بين الشرح، النقاش، والتطبيق العملي</h2>
               <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ background: 'var(--gold)', color: 'var(--navy)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                     <div>
                        <strong style={{ display: 'block', fontSize: '18px', color: 'var(--navy)' }}>نقاش وحوار</strong>
                        <p style={{ color: 'var(--text-2)', marginTop: '4px' }}>يبدأ كل محور بسؤال يُثير التفكير قبل أي طرح نظري.</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ background: 'var(--gold)', color: 'var(--navy)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                     <div>
                        <strong style={{ display: 'block', fontSize: '18px', color: 'var(--navy)' }}>دراسات حالة واقعية</strong>
                        <p style={{ color: 'var(--text-2)', marginTop: '4px' }}>مبنية على مواقف حقيقية من بيئة العمل العربية والخليجية.</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ background: 'var(--gold)', color: 'var(--navy)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                     <div>
                        <strong style={{ display: 'block', fontSize: '18px', color: 'var(--navy)' }}>أنشطة تطبيقية</strong>
                        <p style={{ color: 'var(--text-2)', marginTop: '4px' }}>تربط كل مفهوم نظري بتجربة المشارك المهنية مباشرة.</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ background: 'var(--gold)', color: 'var(--navy)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>4</div>
                     <div>
                        <strong style={{ display: 'block', fontSize: '18px', color: 'var(--navy)' }}>خطة عمل شخصية</strong>
                        <p style={{ color: 'var(--text-2)', marginTop: '4px' }}>قابلة للتطبيق خلال 90 يوماً بعد انتهاء الدورة.</p>
                     </div>
                  </div>
               </div>
               <div style={{ background: 'var(--blue-track)', padding: '16px', borderRadius: '12px', marginTop: '24px', color: 'var(--navy)', fontWeight: '600' }}>
                  لا تكتفي الدورة بشرح مفاهيم القيادة التحويلية، بل تُدرّب المشارك خطوة بخطوة على استخدامها في قراره القيادي اليومي.
               </div>
            </div>
         </div>
      </section>

      {/* Trainer Profile */}
      <section className="landing-section" id="trainer">
         <div className="section-heading" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
            <div className="landing-kicker">عن المدرب</div>
         </div>
         <div className="trainer-profile-card" style={{ margin: '0 auto', display: 'block', position: 'relative', boxShadow: 'none', border: '1px solid var(--line)' }}>
            <div className="trainer-profile-head">
              <img src="/brand/dr-mohammad.jpg" alt="د. محمد أبوزيد" />
              <div>
                <h2>د. محمد أبوزيد</h2>
                <p>خبير استراتيجي ومدرب قيادي</p>
              </div>
            </div>
            <div className="trainer-profile-body">
              <p>
                يمتلك د. محمد أبوزيد خبرة واسعة في تطوير القيادات وبناء الكفاءات المؤسسية، في القطاعين الحكومي والخاص، داخل ماليزيا والعالم العربي.
              </p>
              <p>
                قدّم برامج نوعية في القيادة والتخطيط الاستراتيجي وقيادة التغيير، بالتعاون مع جهات رائدة من بينها وزارة الدفاع العُمانية، المراسم الملكية السعودية، ووزارة الاقتصاد العُماني، والمجلس الأعلى للقضاء العُماني، وجامعة الإمارات، والجامعة الإسلامية العالمية بماليزيا.
              </p>
              <div className="trainer-profile-highlight">
                <strong style={{ color: 'var(--gold)' }}>&quot;القيادة الحقيقية لا تُقاس بعدد من يتبعك، بل بعدد القادة الذين تصنعهم من حولك. هذا ما أحاول ترسيخه في كل برنامج أقدّمه.&quot;</strong>
              </div>
            </div>
         </div>
      </section>

      {/* Registration CTA */}
      <section className="cta-section" id="register">
         <h2 className="cta-title">ابدأ رحلة التّحوّل اليوم</h2>
         <p className="cta-subtitle">
            القيادة التحويلية ليست موهبة يُولد بها القائد، بل مجموعة ممارسات يمكن تعلّمها وإتقانها. الفارق بين المؤسسات التي تزدهر وسط التعقيد، وتلك التي تتعثر أمامه، هو طريقة القيادة.
         </p>
         <form className="email-registration-form">
            <label htmlFor="email" className="email-registration-label">البريد الإلكتروني للمشارك</label>
            <div className="email-registration-input-group">
               <input type="email" id="email" className="email-registration-input" placeholder="name@example.com" required />
               <button type="button" className="email-registration-submit">الدخول</button>
            </div>
         </form>
         
         <div className="contact-info">
            <div className="contact-item">
               <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
               mizeed@gmail.com
            </div>
            <div className="contact-item">
               <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
               <span dir="ltr">+60 11 1111 1104</span>
            </div>
            <div className="contact-item">
               <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
               www.mohammadabozeed.com
            </div>
         </div>
      </section>

    </main>
  );
}
