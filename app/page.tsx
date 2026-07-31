/* eslint-disable @next/next/no-img-element */
import { SiteHeader } from "@/app/components/site-header";
import { RegistrationForm } from "@/app/components/registration-form";
import { ImageSlider } from "@/app/components/image-slider";

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
                     الدخول في الدورة
                  </a>
                  <a href="#curriculum" className="secondary-link" style={{ padding: '14px 28px', fontSize: '18px' }}>
                     استعرض المحاور
                  </a>
               </div>

               <div style={{ marginTop: '40px', display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <span style={{ fontSize: '14px', color: 'var(--text-3)' }}>الجهة المنظمة</span>
                     <img 
                        src="/brand/ministry-logo-cropped.jpg" 
                        alt="وزارة التنمية الإدارية" 
                        style={{ 
                           display: 'block',
                           width: '220px',
                           height: 'auto',
                           mixBlendMode: 'multiply',
                           objectFit: 'contain'
                        }} 
                     />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <span style={{ fontSize: '14px', color: 'var(--text-3)' }}>التاريخ</span>
                     <strong style={{ color: 'var(--navy)', fontSize: '18px' }}>
                        2 - 5 اغسطس 2026
                     </strong>
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
               <h2 className="landing-title" style={{ margin: '0 auto' }}>يهدف البرنامج إلى تمكين المشارك من تحقيق ما يلي:</h2>
            </div>
            <div className="cards-grid">
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>1</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>شرح المفهوم العام للقيادة، ومعرفة أنماطها والتمييز بينها.</h3>
                  <p style={{ fontSize: '15px' }}>التعرف على أدبيات القيادة التقليدية، ومزاياها وأسباب تطورها والحاجة إليها.</p>
               </div>
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>2</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>فهم أسس القيادة التحويلية، وتطبيق نموذج الأركان الأربعة (4I&apos;s) في بيئة العمل.</h3>
                  <p style={{ fontSize: '15px' }}>اكتشاف جوهر القيادة التحويلية وأهمية أن تقود بالمعنى لا بالأرقام والمؤشرات.</p>
               </div>
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>3</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>بناء رؤية مؤسسية ملهمة، وسرد قصتها بفعالية لتحفيز الالتزام والانتماء لدى الفريق.</h3>
                  <p style={{ fontSize: '15px' }}>الانتقال من رؤية مكتوبة على الجدار إلى رؤية يرددها الموظفون ويؤمنون بها، وتترجم إلى سلوكيات حقيقية.</p>
               </div>
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>4</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>قيادة التحول والابتكار المؤسسي في بيئات متغيرة ومعقّدة تتسم بالغموض وعدم اليقين (VUCA).</h3>
                  <p style={{ fontSize: '15px' }}>فهم أسباب فشل التحوّلات الكبرى، وتحويل المقاومة إلى مشاركة فاعلة.</p>
               </div>
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>5</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>توظيف الذكاء العاطفي والتدريب القيادي لبناء فرق عالية الأداء.</h3>
                  <p style={{ fontSize: '15px' }}>الانتقال من مدير يُصدر التعليمات إلى مدرّب يطرح الأسئلة الصحيحة ويُطوّر قادة المستقبل.</p>
               </div>
               <div className="feature-card">
                  <div className="feature-icon">
                     <strong>6</strong>
                  </div>
                  <h3 style={{ fontSize: '18px', lineHeight: '1.4' }}>تحويل ممارسات القيادة التحويلية إلى أثر مؤسسي مستدام.</h3>
                  <p style={{ fontSize: '15px' }}>بناء منظمات تتعلم وتتكيف مع المستقبل.</p>
               </div>
            </div>
         </section>

         {/* Curriculum */}
         <section className="landing-section" id="curriculum">
            <div className="curriculum-two-col">
               {/* Left col – heading + timeline */}
               <div className="curriculum-col-text">
                  <div className="section-heading" style={{ marginBottom: '40px' }}>
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
               </div>

               {/* Right col – image slider */}
               <div className="curriculum-col-slider">
                  <ImageSlider />
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
                  <img src="/brand/dr-mohammad-new.png" alt="د. محمد أبوزيد" />
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
            <RegistrationForm />

            <div className="contact-info">

               <div className="contact-item">
                  <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                  <a href="https://www.mohammadabozeed.com" target="_blank" rel="noopener noreferrer">
                     www.mohammadabozeed.com
                  </a>
               </div>
            </div>
         </section>

      </main>
   );
}
