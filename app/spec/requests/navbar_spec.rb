require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page" do

    before {
      visit root_path()
    }

    describe "[Navigation]" do

      #--Topbar--#
      describe "Menu" do
        it "has a nav" do
          page.should have_css("body > nav")
        end

        it "is an unordered list (ul)" do
          page.should have_css("nav > ul")
        end

        it "has a title" do
          page.should have_selector("nav > h6 > a", text: "SpinClip")
        end

        it "has a menu item" do
          page.should have_selector("nav > a.menu-icon")
        end

      end


      describe "both lists have navigation elements" do 
        
        #setup our navbar elements
        @navbar = [
                   {
                     :content => 'Tracks',
                     :div => '#links'
                   },
                   {
                     :content => 'Playlists',
                     :div => '#playlist'
                   },
                   {
                     :content => 'New',
                     :div => '#new'
                   },
                   {
                     :content => 'Popular',
                     :div => '#popular'
                   },
                   {
                     :content => 'Submit',
                     :div => '#submit'
                   },
                   {
                     :content => 'Settings',
                     :div => '#settings'
                   }
                  ]

        #loop and test sidebar & navbar
        @navbar.each do | e |

          it "navbar w/ a list element with id #{e[:div]}" do
            page.should have_css("nav > ul > li" + e[:div])
          end

          it "navbar with content #{e[:content]}" do
            page.should have_selector("nav > ul > li" +e[:div], text: e[:content])

          end

        end


      end





    end #end Navigation

  end #end visits

end
