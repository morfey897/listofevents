import { Container, Typography, Box, Link } from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import { useEffect } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import urljoin from "url-join";
import { SCREENS } from "../enums";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

  h1Size: {
    fontSize: "3rem",
    marginBottom: "0.35em",
    marginTop: "0.15em"
  },

  h2Size: {
    fontSize: "2.15rem",
    marginBottom: "0.30em",
    marginTop: "0.10em"
  }
}));

function PrivacyPolicyScreen({ location }) {

  const classes = useStyles();

  useEffect(() => {
    let hashId = location.hash.replace('#', '');
    if (hashId) {
      const element = document.getElementById(hashId);
      if (element) {
        const top = window.pageYOffset + element.getBoundingClientRect().top - 64;
        if (top !== undefined) {
          window.scroll({
            top,
            left: 0,
            behavior: 'smooth'
          });
        }
      };
    }
  }, [location]);

  return <Container className={classes.container}>
    <Typography variant="h1" className={classes.h1Size}>Политика конфиденциальности {process.env.APP_NAME}</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      1. Общие положения
    </Typography>
    <Typography variant="body1">1.1. Администрация сайта {process.env.HOST} (далее – «Администрация) публикует настоящую Политику конфиденциальности в отношении пользователей (далее – «Пользователь») Сайта https://take.travel (далее – «Сайт»).</Typography>
    <Typography variant="body1">1.2. Настоящая Политика конфиденциальности содержит информацию о том, как собирается, используется и раскрывается персональная информация о Пользователях Сайта.</Typography>
    <Typography variant="body1">1.3. Перед использованием Сайта просим Вас внимательно ознакомиться с изложенными ниже условиями использования персональной информации. Пользуясь Сайтом, вы понимаете изложенные в настоящей Политике конфиденциальности условия и подтверждаете свое согласие с ними.</Typography>
    <Typography variant="body1">1.4. Если вы не согласны с какими - либо пунктами Политики конфиденциальности, то вы обязаны отказаться от использования Сайта.Использование Сайта без согласия с условиями настоящей Политики конфиденциальности не допускается.</Typography>
    <Typography variant="body1">1.5. Если Вам не ясны какие - либо пункты Политики конфиденциальности, вы обязаны предварительно обратиться к Администрации за разъяснениями и только после получения разъяснений использовать Сайт.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      2. Действие Политики конфиденциальности в отношении несовершеннолетних
    </Typography>
    <Typography variant="body1">2.1. Использование персональной информации Администрацией осуществляется в полном соответствии с требованиями Закона о защите конфиденциальности детей в Интернете (COPPA).</Typography>
    <Typography variant="body1">2.2. Использование Сайта лицами в возрасте младше 18 лет не допускается.Используя сайт, Пользователь подтверждает, что он достиг возраста 18 лет.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      3. Перечень используемой персональной информации
    </Typography>
    <Typography variant="body1">3.2. Персональная информация личного характера, которая может быть запрошена у Пользователя при использовании Сайта:</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">3.2.1. Имя, Фамилия.</Typography>
      <Typography variant="body1">3.2.2. Адрес электронной почты.</Typography>
      <Typography variant="body1">3.2.3. Номер телефона.</Typography>
      <Typography variant="body1">3.2.4. Данные о местонахождении и месте проживания Пользователя.</Typography>
      <Typography variant="body1">3.2.5. Дата рождения.</Typography>
      <Typography variant="body1">3.2.7. Пол.</Typography>
    </Box>
    <Typography variant="body1">3.3. Администрация не обрабатывает персональные данные субъекта, касающиеся политических взглядов, религиозных или философских убеждений.</Typography>
    <Typography variant="body1">3.4. Администрация вправе запросить у Пользователя дополнительную информацию личного характера, в этом случае предоставление такой информации Пользователем одновременно означает согласие Пользователя с обработкой такой информации.</Typography>
    <Typography variant="body1">3.5. При использовании Сайта Администрация может обрабатывать следующую персональную информацию, не содержащую личные данные Пользователя:</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">3.5.1. Данные о технических средствах (устройствах), технологическом взаимодействии с Сайтом (в т.ч. IP-адрес хоста, вид операционной системы пользователя, тип браузера, географическое положение, поставщик услуг Интернета).</Typography>
      <Typography variant="body1">3.5.2. Время посещения Сайта и последующие действия Пользователя на Сайте.</Typography>
      <Typography variant="body1">3.5.3. Информацию, автоматически получаемую с помощью технологии cookies.</Typography>
      <Typography variant="body1">3.5.4. Иную персональную информацию, которую Пользователь предоставил Администрации в связи с использованием им Сайта.</Typography>
    </Box>
    <Typography variant="body1">3.6. Пользователь обязуется предоставлять Администрации исключительно достоверную и актуальную информацию о своих персональных данных. В случае обнаружения Администрацией фактов предоставления недостоверной или неактуальной информации, Администрация вправе отказать Пользователю в оказании услуг.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      4. Соблюдение прав Пользователя по стандартам GDPR
    </Typography>
    <Typography variant="body1">4.1. Пользователь в соответствии со стандартами Общего регламента по защите данных(GDPR) вправе в любой момент запросить у Администрации подтверждение факта обработки его данных, место и цель обработки, категории обрабатываемых персональных данных, каким третьим лицам персональные данные раскрываются, период, в течение которого данные будут обрабатываться, а также уточнить источник получения Администрацией персональной информации и требовать ее исправления.</Typography>
    <Typography variant="body1">4.2. Пользователь в соответствии со стандартами Общего регламента по защите данных(GDPR) вправе в любой момент воспользоваться правом на забвение, подразумевающим удаление персональной информации Пользователя по его запросу, в этом случае при прекращении обработки персональной информации Пользователя Администрация не сможет предоставить Пользователю возможность использовать Сайт.</Typography>
    <Typography variant="body1">4.3. Пользователь в соответствии со стандартами Общего регламента по защите данных(GDPR) вправе воспользоваться правом на переносимость данных, а именно потребовать от Администрации предоставить бесплатно электронную копию персональной информации другой компании.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      5. Цели использования персональной информации
    </Typography>
    <Typography variant="body1">5.1. Администрация использует персональную информацию Пользователей только для строго определенных целей, в частности указанные цели включают в себя:</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">5.1.1. Предоставление Пользователю возможности использовать Сайт.</Typography>
      <Typography variant="body1">5.1.2. Информирование Пользователя о возможностях, связанных с использованием Сайта и о предоставляемых Администрацией и ее партнерами услугах.</Typography>
      <Typography variant="body1">5.1.3. Поддержание обратной связи между Администрацией и Пользователем.</Typography>
      <Typography variant="body1">5.1.4. Направление Пользователю предложений рекламного и коммерческого характера.</Typography>
      <Typography variant="body1">5.1.5. Предоставление Пользователям технической поддержки.</Typography>
      <Typography variant="body1">5.1.6. Анализ статистики использования Сайта Пользователями.</Typography>
      <Typography variant="body1">5.1.7. Улучшение Сайта.</Typography>
      <Typography variant="body1">5.1.8. Защита Пользователя от мошенничества.</Typography>
    </Box>
    <Typography variant="h2" className={classes.h2Size}>
      6. Принципы использования персональной информации
    </Typography>
    <Typography variant="body1">6.1. Администрация при использовании персональной информации о Пользователях обязуется придерживаться следующих основных принципов использования персональной информации, установленных Общим регламентом по защите данных (GDPR):</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">6.1.1. Законность, справедливость и прозрачность. Персональные данные обрабатываются законно, справедливо и прозрачно. Любая информация о целях, методах и объемах обработки персональной информации излагается максимально доступно и просто.</Typography>
      <Typography variant="body1">6.1.2. Ограничение цели. Данные собираются и используются исключительно в тех целях, которые заявлены в настоящей Политике.</Typography>
      <Typography variant="body1">6.1.3. Минимизация данных.Администрация не собирает персональную информацию в большем объеме, чем это необходимо для целей, указанных в настоящей Политике.</Typography>
      <Typography variant="body1">6.1.4. Точность.Персональная информация, которая является неточной удаляется либо подлежит исправлению по требованию Пользователя.</Typography>
      <Typography variant="body1">6.1.5. Ограничение хранения.Персональная информация хранится сроком не более, чем это необходимо для целей обработки.</Typography>
      <Typography variant="body1">6.1.6. Целостность и конфиденциальность.При обработке данных Пользователей Администрация обеспечивает защиту персональных данных от несанкционированной или незаконной обработки, уничтожения и повреждения.</Typography>
    </Box>
    <Typography variant="h2" className={classes.h2Size}>
      7. Защита персональной информации
    </Typography>
    <Typography variant="body1">7.1. Администрация гарантирует, что она не будет разглашать, либо передавать третьим лицам персональную информацию о Пользователе, за исключением случаев, прямо предусмотренных действующим законодательством и настоящей Политикой.</Typography>
    <Typography variant="body1">7.2. Администрация обязуется предпринимать все необходимые организационные и технические меры для защиты персональной информации о Пользователе от неправомерного или случайного доступа третьих лиц, уничтожения, изменения, блокирования, копирования, распространения, а также иных неправомерных действий третьих лиц.</Typography>
    <Typography variant="body1">7.3. Пользователь со своей Стороны обязуется предпринимать все необходимые меры с целью снижения рисков получения доступа третьими лицами к его персональной информации, в том числе Пользователь должен выбрать надежный пароль, использовать разные пароли для разных приложений и сайтов, регулярно обновлять антивирусные программы.</Typography>
    <Typography variant="body1">7.4. Данные банковских карт и личная информация не будут храниться, продаваться, передаваться, сдаваться в аренду третьим лицам.</Typography>
    <Typography variant="body1">7.5. Администрация не передает данные банковских карт третьим лицам.</Typography>
    <Typography variant="body1">7.6. Администрация принимает соответствующие меры для обеспечения конфиденциальности и безопасности данных, в том числе с помощью различных аппаратных и программных методологий.Однако https://take.travel не может гарантировать безопасность любой информации, раскрываемой в Интернете.</Typography>
    <Typography variant="body1">7.7. Администрация не несет ответственности за политику конфиденциальности сайтов, на которые она ссылается.Если вы предоставляете какую - либо информацию таким третьим лицам, могут применяться другие правила, касающиеся сбора и использования вашей личной информации.Вам следует напрямую связаться с этими организациями, если у вас есть какие - либо вопросы об использовании ими собираемой информации.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      8. Предоставление данных о Пользователе третьим лицам
    </Typography>
    <Typography variant="body1">8.1. Администрация вправе передавать персональную информацию о Пользователем третьим лицам - партнерам Администрации, которые фактически будут оказывать услуги Пользователю.</Typography>
    <Typography variant="body1">8.2. Сайт может содержать ссылки, в том числе рекламного характера на другие интернет - ресурсы.Указанные интернет - ресурсы и их контент не проверяются Администрацией, в частности Администрация не контролирует использование указанными интернет - ресурсами персональной информации Пользователей.</Typography>
    <Typography variant="body1">8.3. Пользователь понимает, что Администрация может предоставлять третьим лицам обобщенную статистику о Пользователях Сайта для целей проведения статистического анализа, повышения эффективности работы Сайта.</Typography>
    <Typography variant="body1">8.4. Пользователь понимает, что Администрация в соответствии с требованиями Общего регламента по защите данных(GDPR) обязана уведомлять регулирующие органы о любых нарушениях, связанных с использованием персональной информации в течение 72 часов после обнаружения такого нарушения.</Typography>
    <Typography variant="h2" className={classes.h2Size}>9. Как мы используем файлы cookie и технологии отслеживания?</Typography>
    <Typography variant="body1">9.1. Когда вы используете Сайт и получаете к нему доступ, мы можем разместить какое-то количество cookie-файлов в Вашем веб браузере.</Typography>
    <Typography variant="body1">9.2. Администрация использует или может использовать cookie - файлы и веб - маячки, чтобы определять пользователей, использующих сайт неоднократно, тип контента и сайты, на которые переходит пользователь нашего Сайта, сколько времени каждый пользователь тратит на просмотр каждого из разделов Сайта и конкретные функции, которые пользователи предпочитают использовать.В связи с тем, что cookie - файлы представляют собой персональную идентифицирующую информацию, мы обрабатываем такие данные только с Вашего согласия.</Typography>
    <Typography variant="body1">9.3. Мы используем как сессионные, так и постоянные cookie - файлы на нашем Сайте.А также мы используем различные типы cookie - файлов для обеспечения нормального функционирования Сайта:</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">9.3.1. Строго необходимые файлы cookie. Необходимы для корректной работы Сайта. Мы можем использовать строго необходимые файлы cookie, чтобы предложить пользователю использовать возможности Сайта.</Typography>
      <Typography variant="body1">9.3.2. Аналитические cookie-файлы. Позволяют нам распознавать и подсчитывать количество посетителей Сайта, а также отслеживать и анализировать передвижения пользователей по Сайту. Данная информация помогает нам улучшать работу сайта.</Typography>
      <Typography variant="body1">9.3.3. Функциональные файлы cookie.Эти файлы cookie служат для того, чтобы опознавать пользователей, возвращающихся на Сайт.Они позволяют нам индивидуально подбирать содержание Сайта для Вас и запоминать Ваши предпочтения.</Typography>
      <Typography variant="body1">9.3.4. Рекламные файлы cookie.Записывают сведения о посещениях Вами Сайта, страницы, которые вы посещали и ссылки, на которые переходили.Мы используем данную информацию, чтобы сделать Сайт более соответствующим Вашим интересам.Для этой же цели мы также можем передавать эту информацию третьим сторонам.</Typography>
    </Box>
    <Typography variant="body1">9.4. Кроме наших собственных cookie-файлов мы также можем использовать cookie-файлы третьих лиц для создания статистики пользования Сайтом и улучшения маркетинговых усилий.</Typography>
    <Box mx={1} my={1}>
      <Typography variant="body1">9.4.1. Отслеживающие файлы cookie. Отслеживают поведение пользователя на сайте и связывают его с другими параметрами, что позволяет лучше понять привычки пользователей.</Typography>
      <Typography variant="body1">9.4.2. Оптимизационные файлы cookie. Позволяют отслеживать в реальном времени переход пользователей на Сайт с различных маркетинговых каналов и оценивать их эффективность.</Typography>
      <Typography variant="body1">9.4.3. Партнерские файлы cookie.Предоставляют показатели перехода пользователей с маркетинговых платформ нашим партнерам для оптимизации ими собственных маркетинговых усилий.</Typography>
    </Box>
    <Typography variant="h2" className={classes.h2Size}>
      10. Управление файлами cookie
    </Typography>
    <Typography variant="body1">10.1. Если вы хотите удалить cookie-файлы или отказаться от их сохранения, перейдите в справочный центр Вашего браузера. Пожалуйста, обратите внимание, что, если удалить cookie-файлы или откажется от их использования, возможности пользования нашим Сайтом могут быть ограничены частично или полностью. Не будет возможности сохранять свои предпочтения, некоторые страницы могут отображаться некорректно.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      11. Изменение Политики конфиденциальности
    </Typography>
    <Typography variant="body1">11.1. Администрация оставляет за собой право в любой момент внести изменения в любой из пунктов Политики конфиденциальности, не допуская при этом включение в Политику положений, противоречащих действующему законодательству. При внесении изменений в актуальной редакции указывается дата последнего обновления. Новая редакция Политики вступает в силу с момента ее размещения, если иное не предусмотрено редакцией Политики.</Typography>
    <Typography variant="body1">11.2. Пользователи обязаны регулярно отслеживать изменения в настоящей Политике конфиденциальности на предмет возможных изменений.</Typography>
    <Typography variant="h2" className={classes.h2Size}>
      12. Поддержка Пользователей
    </Typography>
    <Typography variant="body1">12.1. Пользователь вправе в любой момент обратиться к Администрации с вопросами относительно положений настоящей Политики конфиденциальности посредством направления запроса по контактам, размещенным на Сайте по адресу: <Link component={RouterLink} to={SCREENS.CONTACTS}>{urljoin(process.env.HOST, SCREENS.CONTACTS)}</Link>. При направлении обращения Пользователь обязан максимально подробно описать возникший вопрос, либо проблему, а по запросу Администрации предоставить дополнительные данные.</Typography>
  </Container>;
}

export default withRouter(PrivacyPolicyScreen);