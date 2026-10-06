import { cases } from '../data/content'
import { caseStudies } from '../data/cases'
import { Screen, titleId } from '../components/layout/Screen'
import { CaseStudyView } from '../components/cases/CaseStudyView'

export function CasesSection() {
  const study = caseStudies[0]

  return (
    <Screen id="cases" tone="deep">
      <h2 id={titleId('cases')} className="display-md mb-6 max-w-[22ch] lg:text-[2.25rem]">
        {cases.headline}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col">
        <CaseStudyView study={study} />
      </div>
    </Screen>
  )
}
