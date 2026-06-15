import { SiteHeader } from "@/app/components/site-header";
import { ActivityCodeGate } from "@/app/components/shared/activity-code-gate";
import { EmailGate } from "@/app/components/shared/email-gate";

export function AssessmentHub() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero compact-hero">
        <div className="section-kicker">التمارين و المقاييس</div>
        <h1>أنشطة الدورة الحالية في مساحة واحدة</h1>
        <p>
          تضم هذه المساحة اختبار اليوم الأول، وتمارين التطبيق، ومقياس نمط
          قيادة الذكاء الاصطناعي. أدخل بريدك أولاً حتى تُحفظ إجاباتك ونتائجك
          باسمك في لوحة المدرب.
        </p>
      </section>

      <EmailGate
        title="أدخل بريدك لفتح التمارين و المقاييس"
        description="بعد إدخال البريد ستظهر لك أنشطة الدورة الحالية، وسنحفظ إجاباتك ونتائجك حتى يستطيع المدرب متابعتها."
      >
        <section className="content-band">
          <div className="hub-card-grid">
            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">01 | اختبار</div>
                <h2>اختبار اليوم الأول - المفاهيم الأساسية</h2>
                <p>
                  اختبار سريع عبر Kahoot لمراجعة مفاهيم اليوم الأول والتأكد من
                  وضوح الأساسيات قبل الانتقال للأنشطة التالية.
                </p>
              </div>
              <ActivityCodeGate
                activityId="day-one-concepts-test"
                activityTitle="اختبار اليوم الأول"
                compact
              >
                <a
                  href="https://kahoot.it/challenge/06310431?challenge-id=bf0843d2-b155-49ee-b62d-b059a605e472_1781253303544"
                  className="primary-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  فتح الاختبار
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">02 | تمرين</div>
                <h2>تمرين تشريح الأمر الهندسي</h2>
                <p>
                  اقرأ برومبتًا كاملًا ثم صنّف أجزاءه داخل مكونات الأمر السبعة:
                  الدور، السياق، المهمة، القيود، النبرة، المثال، والتنسيق.
                </p>
              </div>
              <ActivityCodeGate
                activityId="prompt-anatomy"
                activityTitle="تمرين تشريح الأمر الهندسي"
                compact
              >
                <a href="/exercises/prompt-anatomy" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">03 | تمرين</div>
                <h2>هندسة الأوامر الاحترافية</h2>
                <p>
                  أنشئ مشروع هندسة أوامر احترافية وفق الأطر الحديثة التي تم
                  شرحها في الدورة، مع أمر موسع وآخر مبسط قابلين للنسخ مباشرة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="professional-prompt-engineering"
                activityTitle="هندسة الأوامر الاحترافية"
                compact
              >
                <a
                  href="/exercises/professional-prompt-engineering"
                  className="primary-link"
                >
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">04 | تمرين</div>
                <h2>إنشاء مشروع تحليل SWOT</h2>
                <p>
                  حمّل ملف swot-core المرفق، ثم استخدمه لبناء مشروع ذكاء
                  اصطناعي يجري التحليل الرباعي للشركات بطريقة منهجية.
                </p>
              </div>
              <ActivityCodeGate
                activityId="swot-project"
                activityTitle="إنشاء مشروع تحليل SWOT"
                compact
              >
                <a href="/exercises/swot-project" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">05 | تمرين</div>
                <h2>تمرين صياغة أمر</h2>
                <p>
                  تمرين تفاعلي لصياغة أمر متكامل من سبعة مكونات، مع تقييم
                  فوري بالذكاء الاصطناعي وتوصيات لتحسين الصياغة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="prompt-writing"
                activityTitle="تمرين صياغة أمر"
                compact
              >
                <a href="/exercises/prompt-writing" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">06 | تمرين</div>
                <h2>تمرين بناء استبيان باستخدام الذكاء الاصطناعي</h2>
                <p>
                  اكتب برومبتاً يساعد الذكاء الاصطناعي على بناء استبيان عملاء
                  لشركة أزياء قبل اتخاذ قرار الاستثمار في TikTok Shop.
                </p>
              </div>
              <ActivityCodeGate
                activityId="survey-builder"
                activityTitle="تمرين بناء استبيان باستخدام الذكاء الاصطناعي"
                compact
              >
                <a href="/exercises/survey-builder" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">07 | تمرين</div>
                <h2>تمرين مقارنة أمر بصيغتين</h2>
                <p>
                  قارن بين صياغة عامة وأخرى محددة، وانسخ كل أمر مباشرة لتجربته
                  وملاحظة أثر جودة الصياغة على استجابة الذكاء الاصطناعي.
                </p>
              </div>
              <ActivityCodeGate
                activityId="prompt-comparison"
                activityTitle="تمرين مقارنة أمر بصيغتين"
                compact
              >
                <a href="/exercises/prompt-comparison" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">08 | تمرين</div>
                <h2>تمرين حساب الرموز Tokens</h2>
                <p>
                  استخدم أداة OpenAI Tokenizer لمقارنة عدد الرموز والمحارف بين
                  جملتين، ثم سجّل ملاحظتك حول الفرق بين النص الواضح والنص غير
                  المألوف.
                </p>
              </div>
              <ActivityCodeGate
                activityId="token-count"
                activityTitle="تمرين حساب الرموز Tokens"
                compact
              >
                <a href="/exercises/token-count" className="primary-link">
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">09 | تمرين</div>
                <h2>تمرين شريك التفكير - أزمة منصة مهيمنة</h2>
                <p>
                  تمرين سريع يستخدم الذكاء الاصطناعي كشريك تفكير لفهم أزمة
                  Unity، كتابة 3 قرارات أولية، ومهاجمتها بتحليل ما قبل الوفاة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="thinking-partner-crisis"
                activityTitle="تمرين شريك التفكير - أزمة منصة مهيمنة"
                compact
              >
                <a
                  href="/exercises/thinking-partner-crisis"
                  className="primary-link"
                >
                  فتح التمرين
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">10 | تمرين</div>
                <h2>استبيان ما بعد الدورة التدريبية</h2>
                <p>
                  استبيان ختامي قصير لقياس تجربتك، فائدة المحتوى، وما الذي
                  ستطبقه بعد الدورة، مع خيار الموافقة على استخدام شهادتك.
                </p>
              </div>
              <ActivityCodeGate
                activityId="course-completion-survey"
                activityTitle="استبيان ما بعد الدورة التدريبية"
                compact
              >
                <a
                  href="/exercises/course-completion-survey"
                  className="primary-link"
                >
                  فتح الاستبيان
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">11 | تمرين</div>
                <h2>عرّف بنفسك للمجموعة</h2>
                <p>
                  أجب عن أسئلة قصيرة ليتمكن المشاركون من معرفة بلدك وخلفيتك
                  واهتماماتك والنموذج الذي تستخدمه وأهدافك من الدورة.
                </p>
              </div>
              <ActivityCodeGate
                activityId="introductions"
                activityTitle="تعارف المشاركين"
                compact
              >
                <a href="/introductions" className="primary-link">
                  فتح التعارف
                </a>
              </ActivityCodeGate>
            </div>

            <div className="assessment-launch-card">
              <div>
                <div className="section-kicker">12 | مقياس</div>
                <h2>ما نمط قيادتك للذكاء الاصطناعي؟</h2>
                <p>
                  اختبار تفاعلي من 12 سؤالاً يساعدك على معرفة نمطك القيادي في
                  تبني الذكاء الاصطناعي، مع نتيجة تفصيلية وتوصية عملية.
                </p>
              </div>
              <ActivityCodeGate
                activityId="ai-leader-style"
                activityTitle="مقياس نمط قيادة الذكاء الاصطناعي"
                compact
              >
                <a href="/ai-leader-style.html" className="primary-link">
                  بدء المقياس
                </a>
              </ActivityCodeGate>
            </div>
          </div>
        </section>
      </EmailGate>
    </main>
  );
}
